const Joi = require("joi");

module.exports.courseSchema = Joi.object({
  course: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    requirement: Joi.string().required(),
  }).required(),
});
