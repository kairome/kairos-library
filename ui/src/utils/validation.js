/* @flow */
import _ from 'lodash';

const allValidations = {};

const isValiditySet = (node: any, type: string) => {
  const currentNode = allValidations[node];
  if (_.isEmpty(currentNode)) return false;

  const keys = Object.keys(currentNode);

  return _.some(keys, key => !currentNode[key] && key !== type);
};

export const setCustomValidity = (node: any, message: string, validity: boolean, type: string) => {
  let reason = '';

  if (!node.validity.valid && isValiditySet(node.name, type)) return;

  if (!validity) {
    reason = message;
  }

  if (_.isEmpty(allValidations) || _.isEmpty(allValidations[node.name])) {
    allValidations[node.name] = {};
  }

  allValidations[node.name][type] = validity;

  node.setCustomValidity(reason);
};

export const confirmPassword = (password: string, confirm: string, node: any) => {
  const valid = password === confirm;

  setCustomValidity(node, 'Passwords do not match.', valid, 'confirmPassword');
};

export const checkWhiteSpace = (value: string, node: any) => {
  const valid = value.trim() !== '';

  setCustomValidity(node, 'Please fill out this field.', valid, 'whitespace');
};

export const confirmNames = (newName: string, oldName: string, node: any) => {
  const valid = newName.trim() !== oldName.trim();

  setCustomValidity(node, 'Cannot chage to the same name.', valid, 'confirmNames');
};
