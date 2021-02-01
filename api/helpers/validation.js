const { validate } = require('./../../assets/js/validation.js');
module.exports = {


  friendlyName: 'Validation',


  description: 'Validation something.',


  inputs: {

    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },


  exits: {
    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs , exits) {
    let output  = validate(inputs.req, { error_display_html : false });
    console.log(output);
    exits.success(output);
  }
};