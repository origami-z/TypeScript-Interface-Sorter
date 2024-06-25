// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../../extension';

describe('Extension Test Suite', () => {
	// TODO: follow this to enable vscode import for jest
	// https://github.com/microsoft/vscode-test/issues/37#issuecomment-700167820
	// vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		expect([1, 2, 3].indexOf(5)).toEqual(-1);
		expect([1, 2, 3].indexOf(0)).toEqual(-1);
	});
});
