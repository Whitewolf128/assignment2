import Joi from "joi";
// Post operation schemas organized by request part

export const postSchema = {
    //// POST /posts - Create new post
    create: {
        body: Joi.object({
            title: Joi.string().required(),
            description: Joi.string().required(),
            priority: Joi.string().valid("low", "medium", "high", "critical").required(),
            baseScore: Joi.number(),
            status: Joi.string().valid("open", "in-progress", "resolved"),
            content: Joi.string().required().messages({
                "title.required": `Missing required field: Title`,
                "description.required": `Missing required field: Description`,
                "priority.invalid": `Invalid priority. Must be one of: critical, high, medium, low`,
            }), 
        }),
    },
    // PUT /posts/:id - Update post
    update: {
        title: Joi.string().required(),
        description: Joi.string().required(),
        priority: Joi.string().valid("low", "medium", "high", "critical").required(),
        baseScore: Joi.number(),
        status: Joi.string().valid("open", "in-progress", "resolved"),
        content: Joi.string().required().messages({
                "priority.invalid": `Invalid priority. Must be one of: critical, high, medium, low`,
                "status.invalid": `Invalid status. Must be one of: open, in-progress, resolved`,
        }), 
    }
}
