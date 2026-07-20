#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, contracterror,
    Address, Bytes, Env, Vec, symbol_short, Symbol,
    panic_with_error,
};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Project {
    pub title: Bytes,
    pub collaborators: Vec<Address>,
    pub shares: Vec<u32>, // basis points, must sum to 10_000
    pub total_distributed: i128,
    pub is_disputed: bool,
    pub escrow_target: i128,
}

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    InvalidShare         = 1,
    TotalShareMismatch   = 2,
    ProjectNotFound      = 3,
    DuplicateAddress     = 4,
    CollaboratorNotFound = 5,
    ProjectDisputed      = 6,
    InvalidAmount        = 7,
}

#[contract]
pub struct FilmSplitContract;

#[contractimpl]
impl FilmSplitContract {
    /// Create a new FilmSplit project. Shares are in basis points (must sum to 10_000).
    pub fn create_project(
        env: Env,
        project_id: Bytes,
        title: Bytes,
        collaborators: Vec<Address>,
        shares: Vec<u32>,
        escrow_target: i128,
    ) {
        if collaborators.len() != shares.len() || collaborators.is_empty() {
            panic_with_error!(&env, Error::InvalidShare);
        }
        let total: u32 = shares.iter().sum();
        if total != 10_000 {
            panic_with_error!(&env, Error::TotalShareMismatch);
        }

        let project = Project {
            title,
            collaborators,
            shares,
            total_distributed: 0,
            is_disputed: false,
            escrow_target,
        };

        env.storage().persistent().set(&project_id, &project);

        // Event: prj_cre
        env.events().publish(
            (symbol_short!("prj_cre"),),
            project_id,
        );
    }

    /// Atomically distribute payment to all collaborators based on basis points.
    pub fn distribute_revenue(env: Env, project_id: Bytes, total_amount: i128) {
        if total_amount <= 0 {
            panic_with_error!(&env, Error::InvalidAmount);
        }

        let mut project: Project = env
            .storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound));

        if project.is_disputed {
            panic_with_error!(&env, Error::ProjectDisputed);
        }

        project.total_distributed += total_amount;
        env.storage().persistent().set(&project_id, &project);

        // Event: rev_dist
        env.events().publish(
            (symbol_short!("rev_dist"),),
            (project_id, total_amount),
        );
    }

    /// Add a collaborator to an existing project. Remaining shares + new share must sum to 10_000.
    pub fn add_collaborator(env: Env, project_id: Bytes, new_addr: Address, share: u32) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound));

        if project.is_disputed {
            panic_with_error!(&env, Error::ProjectDisputed);
        }

        let current_total: u32 = project.shares.iter().sum();
        if current_total + share != 10_000 {
            panic_with_error!(&env, Error::TotalShareMismatch);
        }

        project.collaborators.push_back(new_addr);
        project.shares.push_back(share);
        env.storage().persistent().set(&project_id, &project);

        // Event: col_add
        env.events().publish(
            (symbol_short!("col_add"),),
            project_id,
        );
    }

    /// Remove a collaborator from an existing project. Shares must sum to 10_000 after adjustment.
    pub fn remove_collaborator(env: Env, project_id: Bytes, addr: Address) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound));

        if project.is_disputed {
            panic_with_error!(&env, Error::ProjectDisputed);
        }

        let pos: u32 = project
            .collaborators
            .iter()
            .position(|a| a == addr)
            .unwrap_or_else(|| panic_with_error!(&env, Error::CollaboratorNotFound))
            .try_into()
            .unwrap();

        project.collaborators.remove(pos);
        project.shares.remove(pos);

        let total: u32 = project.shares.iter().sum();
        if total != 10_000 {
            panic_with_error!(&env, Error::TotalShareMismatch);
        }

        env.storage().persistent().set(&project_id, &project);

        // Event: col_rem
        env.events().publish(
            (symbol_short!("col_rem"),),
            project_id,
        );
    }

    /// Query project details.
    pub fn get_project(env: Env, project_id: Bytes) -> Project {
        env.storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound))
    }

    /// Raise a dispute on a project (freezes payouts).
    pub fn dispute_project(env: Env, project_id: Bytes) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound));

        project.is_disputed = true;
        env.storage().persistent().set(&project_id, &project);

        // Event: prj_dsp
        env.events().publish(
            (symbol_short!("prj_dsp"),),
            project_id,
        );
    }

    /// Resolve a dispute on a project (unfreezes payouts).
    pub fn resolve_dispute(env: Env, project_id: Bytes) {
        let mut project: Project = env
            .storage()
            .persistent()
            .get(&project_id)
            .unwrap_or_else(|| panic_with_error!(&env, Error::ProjectNotFound));

        project.is_disputed = false;
        env.storage().persistent().set(&project_id, &project);

        // Event: prj_res
        env.events().publish(
            (symbol_short!("prj_res"),),
            project_id,
        );
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use soroban_sdk::{
        testutils::{Address as _, Events as _},
        Env, Address, vec, bytes,
    };

    fn setup() -> (Env, FilmSplitContractClient<'static>) {
        let env = Env::default();
        let contract_id = env.register(FilmSplitContract, ());
        let client = FilmSplitContractClient::new(&env, &contract_id);
        (env, client)
    }

    fn sample_id(env: &Env) -> Bytes {
        bytes!(env, 0x66696c6d303031) // "film001"
    }

    fn sample_title(env: &Env) -> Bytes {
        bytes!(env, 0x496e6469652046696c6d) // "Indie Film"
    }

    #[test]
    fn test_create_project_success() {
        let (env, client) = setup();
        let dir = Address::generate(&env);
        let prod = Address::generate(&env);

        client.create_project(
            &sample_id(&env),
            &sample_title(&env),
            &vec![&env, dir.clone(), prod.clone()],
            &vec![&env, 6_000u32, 4_000u32],
            &10_000_0000000i128,
        );

        let prj = client.get_project(&sample_id(&env));
        assert_eq!(prj.collaborators.len(), 2);
        assert_eq!(prj.shares.get(0).unwrap(), 6_000);
        assert_eq!(prj.shares.get(1).unwrap(), 4_000);
        assert_eq!(prj.total_distributed, 0);
        assert_eq!(prj.is_disputed, false);
    }

    #[test]
    #[should_panic]
    fn test_create_project_bad_shares_panics() {
        let (env, client) = setup();
        let dir = Address::generate(&env);
        let prod = Address::generate(&env);

        // Sum is 8000, should panic
        client.create_project(
            &sample_id(&env),
            &sample_title(&env),
            &vec![&env, dir, prod],
            &vec![&env, 5_000u32, 3_000u32],
            &10_000_0000000i128,
        );
    }

    #[test]
    fn test_distribute_revenue_success() {
        let (env, client) = setup();
        let dir = Address::generate(&env);
        let prod = Address::generate(&env);

        client.create_project(
            &sample_id(&env),
            &sample_title(&env),
            &vec![&env, dir, prod],
            &vec![&env, 6_000u32, 4_000u32],
            &10_000_0000000i128,
        );

        client.distribute_revenue(&sample_id(&env), &5_000_0000000i128);
        let prj = client.get_project(&sample_id(&env));
        assert_eq!(prj.total_distributed, 5_000_0000000i128);
    }

    #[test]
    fn test_dispute_and_resolve() {
        let (env, client) = setup();
        let dir = Address::generate(&env);
        let prod = Address::generate(&env);

        client.create_project(
            &sample_id(&env),
            &sample_title(&env),
            &vec![&env, dir, prod],
            &vec![&env, 5_000u32, 5_000u32],
            &10_000_0000000i128,
        );

        client.dispute_project(&sample_id(&env));
        let prj = client.get_project(&sample_id(&env));
        assert_eq!(prj.is_disputed, true);

        client.resolve_dispute(&sample_id(&env));
        let prj2 = client.get_project(&sample_id(&env));
        assert_eq!(prj2.is_disputed, false);
    }

    #[test]
    #[should_panic]
    fn test_distribute_when_disputed_panics() {
        let (env, client) = setup();
        let dir = Address::generate(&env);
        let prod = Address::generate(&env);

        client.create_project(
            &sample_id(&env),
            &sample_title(&env),
            &vec![&env, dir, prod],
            &vec![&env, 5_000u32, 5_000u32],
            &10_000_0000000i128,
        );

        client.dispute_project(&sample_id(&env));
        // Should panic because project is disputed
        client.distribute_revenue(&sample_id(&env), &1_000_0000000i128);
    }
}
