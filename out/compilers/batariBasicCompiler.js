"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const application = require("../application");
const filesystem = require("../filesystem");
const compilerBase_1 = require("./compilerBase");
class BatariBasicCompiler extends compilerBase_1.CompilerBase {
    // features
    constructor() {
        super("batariBasic", "batari Basic", [".bas", ".bb"], path.join(application.Path, "out", "bin", "bb"));
    }
    ExecuteCompilerAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('debugger:BatariBasicCompiler.ExecuteCompilerAsync');
            // Premissions
            yield this.RepairFilePermissionsAsync();
            // Compiler options
            let commandName = "2600bas.bat";
            if (application.IsLinux || application.IsMacOS) {
                // Linux or MacOS
                commandName = "./2600basic.sh";
            }
            // Compiler options
            let command = path.join(this.FolderOrPath, commandName);
            let args = [
                `"${this.FileName}"`,
                this.Args
            ];
            // Compiler environment
            let env = {};
            env["PATH"] = this.FolderOrPath;
            if (application.IsLinux || application.IsMacOS) {
                // Additional for Linux or MacOS
                env["PATH"] = ":/bin:/usr/bin:" + env["PATH"];
            }
            env["bB"] = this.FolderOrPath;
            // Process
            this.outputChannel.appendLine(`Building '${this.FileName}'...`);
            // TODO: Actual compile
            this.IsRunning = true;
            this.IsRunning = false;
            // Verify file size
            if (yield !this.VerifyCompiledFileSizeAsync())
                return false;
            // Move file(s) to Bin folder
            if (yield !this.MoveFilesToBinFolderAsync())
                return false;
            // Clean up file(s) creating during compilation
            if (yield !this.RemoveCompilationFilesAsync())
                return false;
            // Result
            return true;
        });
    }
    // protected LoadConfiguration(): boolean {
    //     console.log('debugger:BatariBasicCompiler.LoadConfiguration');  
    //     // Base
    //     if (!super.LoadConfiguration()) return false;
    //     // Result
    //     return true;
    // }
    RepairFilePermissionsAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('debugger:BatariBasicCompiler.RepairFilePermissionsAsync');
            // Validate
            if (this.CustomFolderOrPath || application.IsWindows)
                return true;
            // Prepare
            let architecture = "Linux";
            if (application.IsMacOS)
                architecture = "Darwin";
            // Process
            let result = yield filesystem.SetChMod(path.join(this.FolderOrPath, '2600basic.sh'));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `2600basic.${architecture}.x86`));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `dasm.${architecture}.x86`));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `bbfilter.${architecture}.x86`));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `optimize.${architecture}.x86`));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `postprocess.${architecture}.x86`));
            if (result)
                result = yield filesystem.SetChMod(path.join(this.FolderOrPath, `preprocess.${architecture}.x86`));
            return result;
        });
    }
    RemoveCompilationFilesAsync() {
        const _super = Object.create(null, {
            RemoveCompilationFilesAsync: { get: () => super.RemoveCompilationFilesAsync }
        });
        return __awaiter(this, void 0, void 0, function* () {
            console.log('debugger:BatariBasicCompiler.RemoveCompilationFilesAsync');
            // Language specific files
            if (this.CleanUpCompilationFiles) {
                // Process
                try {
                    yield filesystem.RemoveFile(path.join(this.WorkspaceFolder, `${this.FileName}.asm`));
                    yield filesystem.RemoveFile(path.join(this.WorkspaceFolder, `bB.asm`));
                    yield filesystem.RemoveFile(path.join(this.WorkspaceFolder, `includes.bB`));
                    yield filesystem.RemoveFile(path.join(this.WorkspaceFolder, `2600basic_variable_redefs.h`));
                    // Notify
                    this.notify(`Cleaned up files generated during compilation...`);
                }
                catch (error) {
                    // Notify
                    this.notify(`ERROR: Failed to clean up files generated during compilation (error: ${error})`);
                    return false;
                }
            }
            // Debugger files (from workspace not bin)
            // Note: Remove if option is turned off as they are generated by bB (cannot change I believe)
            return _super.RemoveCompilationFilesAsync.call(this);
        });
    }
}
exports.BatariBasicCompiler = BatariBasicCompiler;
//# sourceMappingURL=batariBasicCompiler.js.map