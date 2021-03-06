"use strict";
import * as vscode from 'vscode';
import * as filesystem from './filesystem';
const os = require("os");
import { CompilerBase } from './compilers/compilerBase';
import { BatariBasicCompiler } from './compilers/batariBasicCompiler';
import { SeventyEightHundredBasicCompiler } from './compilers/seventyEightHundredBasicCompiler';
import { DasmCompiler } from './compilers/dasmCompiler';
import { EmulatorBase } from './emulators/emulatorBase';
import { StellaEmulator } from './emulators/stellaEmulator';
import { A7800Emulator } from './emulators/a7800Emulator';
import { HoverBase } from './hovers/hoverBase';
import { DasmHover } from './hovers/dasmHover';
import { BatariBasicHover } from './hovers/batariBasicHover';
import { SeventyEightHundredBasicHover } from './hovers/seventyEightHundredBasicHover';

// -------------------------------------------------------------------------------------
// Operating System
// -------------------------------------------------------------------------------------
export const OSPlatform: any = os.platform();
export const OSArch: any = os.arch();
export const IsWindows: boolean = (os.platform() === 'win32');
export const IsLinux: boolean = (os.platform() === 'linux');
export const IsMacOS: boolean = (os.platform() === 'darwin');
export const Is32Bit: boolean = (os.arch() === 'x32');
export const Is64Bit: boolean = (os.arch() === 'x64');

// -------------------------------------------------------------------------------------
// Extension
// -------------------------------------------------------------------------------------
export const Id = "chunkypixel.atari-dev-studio";
export const Path: string = vscode.extensions.getExtension(Id)!.extensionPath;
export const Name: string = vscode.extensions.getExtension(Id)!.packageJSON.name;
export const Publisher: string = vscode.extensions.getExtension(Id)!.packageJSON.publisher;
export const Version: string = vscode.extensions.getExtension(Id)!.packageJSON.version;
export const DisplayName: string = vscode.extensions.getExtension(Id)!.packageJSON.displayName;
export const Description: string = vscode.extensions.getExtension(Id)!.packageJSON.description;
export const PreferencesSettingsExtensionPath: string = `${(IsMacOS ? "Code" : "File")} -> Preferences -> Settings -> Extensions -> ${DisplayName}`;

// -------------------------------------------------------------------------------------
// Channels
// -------------------------------------------------------------------------------------
export const CompilerOutputChannel: vscode.OutputChannel = vscode.window.createOutputChannel("Compiler"); 

// -------------------------------------------------------------------------------------
// Compilers
// Register compilers here and in order of preference
// -------------------------------------------------------------------------------------
export const Compilers:CompilerBase[] = [
	new BatariBasicCompiler(),
	new SeventyEightHundredBasicCompiler(),
	new DasmCompiler()
];

// -------------------------------------------------------------------------------------
// Emulators
// Register emulators here and in order of preference
// -------------------------------------------------------------------------------------
export const Emulators:EmulatorBase[] = [
	new StellaEmulator(),
	new A7800Emulator()
];

// -------------------------------------------------------------------------------------
// Hovers
// Language tooltips
// -------------------------------------------------------------------------------------
export const Hovers:HoverBase[] = [
	new DasmHover(),
	new BatariBasicHover(),
	new SeventyEightHundredBasicHover()
];

export async function RegisterHoverProvidersAsync(context: vscode.ExtensionContext): Promise<void> {
	for (let hover of Hovers) {
		await hover.RegisterAsync(context);
	}
}

// -------------------------------------------------------------------------------------
// Functions
// -------------------------------------------------------------------------------------
export async function BuildGameAsync(fileUri: vscode.Uri): Promise<boolean> {
	// Get document
	let document = await filesystem.GetDocumentAsync(fileUri);
	if (!document || document!.uri.scheme != "file") return false;

	// Find compiler
	let compiler = getChosenCompiler(document);
	if (compiler) return await compiler.BuildGameAsync(document);

	// Result
	return false;
}

export async function BuildGameAndRunAsync(fileUri: vscode.Uri): Promise<boolean> {
	// Get document
	let document = await filesystem.GetDocumentAsync(fileUri);
	if (!document || document!.uri.scheme != "file") return false;

	// Find compiler
	let compiler = getChosenCompiler(document);
	if (compiler) return await compiler.BuildGameAndRunAsync(document);

	// Result
	return false;
}

export function Notify(message: string): void {
	CompilerOutputChannel.appendLine(message);
	console.log(`debugger:${message}`);        
}

export function GetConfiguration() : vscode.WorkspaceConfiguration {
	return vscode.workspace.getConfiguration(Name, null);
}

function getChosenCompiler(document: vscode.TextDocument): CompilerBase | undefined {
	// Prepare
	let configuration = GetConfiguration();

	// Find compiler (based on configuration selection)
	let chosenCompiler = configuration.get<string>(`compilation.defaultCompiler`);
	if (chosenCompiler) {
		for (let compiler of Compilers) {
			if (compiler.Id === chosenCompiler || compiler.Name === chosenCompiler) {
				return compiler;
			}
		}	
	}

	// Find compiler (based on language of chosen file)
	for (let compiler of Compilers) {
		if (compiler.Id === document.languageId) {
			return compiler;
		}
	}	

	// // Find compiler (based on extension)
	// let fileExtension = path.extname(document.uri.fsPath).toLowerCase();
	// for (let compiler of Compilers) {
	// 	if (compiler.Extensions.includes(fileExtension)) {
	// 		return compiler;
	// 	}
	// }	

	// Activate output window?
	if (configuration!.get<boolean>(`editor.preserveCodeEditorFocus`))  {
		CompilerOutputChannel.show();
	}

	// Clear output content?
	if (configuration!.get<boolean>(`editor.clearPreviousOutput`))  {
		CompilerOutputChannel.clear();
	}

	// Not found
	Notify(`Unable to determine a compiler to use based on your chosen default compiler '${chosenCompiler}'. Review your selection in ${PreferencesSettingsExtensionPath}.`);

	// Not found
	return undefined;
}