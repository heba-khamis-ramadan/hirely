const generateMessage = (entity) => {
    return {
        notFound: `${entity} not found :(`,
        alreadyExist: `${entity} already exist!!`,
        createdSuccessfully: `${entity} created successfully :)`,
        deletedSuccessfully: `${entity} deleted successfully :)`,
        updatedSuccessfully: `${entity} updated successfully :)`,
        archivedSuccessfully: `${entity} archived successfully :)`,
        restoredSuccessfully: `${entity} restored successfully :)`,
        failToCreate: `failed to create ${entity} :(`,
        failToDelete: `failed to delete ${entity} :(`,
        failToUpdate: `failed to update ${entity} :(`,
    }
};
export const messages = {
    user: {...generateMessage("user"), 
           invalidPassword: "invalid password!!", 
           loggedIn: "logged in successfully :)", 
           loggedIn: "logged out successfully :)"},
    email: {...generateMessage("email")},
    company: {...generateMessage("company")},
    job: {...generateMessage("job")},
    application: {...generateMessage("application")}
}