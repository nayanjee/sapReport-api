const MSG = require('./message');

module.exports = {
  email: function(value) {
    let error = '';
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || value == 'undefined') {
      error = MSG.fieldBlank;
    } else if (!re.test(value.trim())) {
      error = MSG.emailNotValid;
    }
    return error;
  },

  password: function(value) {
    let error = '';
    if (!value || value == 'undefined') error = MSG.fieldBlank;
    return error;
  },

  name: function(value) {
    let error = '';
    if (!value || value == 'undefined') error = MSG.fieldBlank;
    return error;
  },

  firstname: function(value) {
    let error = '';
    const re = /^[a-zA-Z ]{2,30}$/;
    if (!value || value == 'undefined') {
      error = 'fnameBlank';
    } else if (!re.test(value.trim())) {
      error = 'fnameNotValid';
    }
    return error;
  },

  lastname: function(value) {
    let error = '';
    const re = /^[a-zA-Z ]{2,30}$/;
    if (!value || value == 'undefined') {
      error = 'lnameBlank';
    } else if (!re.test(value.trim())) {
      error = 'lnameNotValid';
    }
    return error;
  },

  dob: function(value) {
    let error = '';
    const re = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
    if (!value || value == 'undefined') {
      error = 'dobBlank';
    } else if (!re.test(value.trim())) {
      error = 'dobNotValid';
    }
    return error;
  },

  username: function(value) {
    let error = '';
    const re = /^[a-z0-9]{3,15}$/;
    if (!value || value == 'undefined') {
      error = 'usernameBlank';
    } else if (!re.test(value.trim())) {
      error = 'usernameNotValid';
    }
    return error;
  },

  token: function(value) {
    let error = '';
    const re = /^\d*$/;
    if (!value || value == 'undefined') {
      error = 'tokenBlank';
    } else if (!re.test(value)) {
      error = 'tokenNotValid';
    }
    return error;
  },

  number: function(value) {
    let error = '';
    const re = /^\d*$/;
    if (!value || value == 'undefined') {
      error = 'fieldBlank';
    } else if (!re.test(value)) {
      error = 'fieldInvalid';
    }
    return error;
  },

  dateTime: function(value) {
    let error = '';
    const re = /(0[1-9]|[1-2][0-9]|3[0-1])-(0[1-9]|1[0-2])-[0-9]{4} (2[0-3]|[01][0-9]):[0-5][0-9]/;
    if (!value || value == 'undefined') {
      error = 'fieldBlank';
    } else if (!re.test(value.trim())) {
      error = 'fieldInvalid';
    }
    return error;
  },

  portal: function(value) {
    let error = '';
    if (!value || value == 'undefined') error = MSG.fieldBlank;
    return error;
  },
  
}