"use strict";
import * as vscode from 'vscode';
import { HoverBase } from './hoverBase';

export class SeventyEightHundredBasicHover extends HoverBase {

    constructor() {
        super("7800basic");
    }

    public async RegisterAsync(context: vscode.ExtensionContext): Promise<void> {
        // Files
        await this.LoadHoverFileAsync(context, '6502.txt') // 6502 opcodes
        await this.LoadHoverFileAsync(context, 'vcs.txt')  // Stella & RIOT
        
        // Finalise
        await super.RegisterAsync(context);
    }

}