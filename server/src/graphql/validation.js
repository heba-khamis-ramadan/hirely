export const isValid = (schema, args) => {
    const result = schema.validate(args, {abortEarly: false});
    if (result.error) {
        let messages = result.error.details.map(error);
        throw new Error(messages, {cause: 400});
    }
};