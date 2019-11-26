/*
 * Copyright (c) 2019 Elastos Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
// TODO: Replace with accurate types everywhere there is "any" or "Function".

declare namespace HivePlugin {
    type Opaque<T, K> = T & { __opaque__: K };
    type Int = Opaque<number, 'Int'>;

    /**
     * The class representing File.
     * @class
     */
    interface File {
        /**
         * Get the information(ID, name size, type) of the file got last time.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        getLastInfo(onSuccess: (info: any)=>void, onError?: (err: string)=>void);

        /**
         * Get the information(ID, name, size, type) of the file from the server.
         * 
         * @return
         * A promise object that contains the information(ID, name, size, type) of the file
         * will be returned on success, otherwise a promise object that contains error
         * information will be returned.
         */
        getInfo(onSuccess: (info: any)=>void, onError?: (err: string)=>void): Promise<any>;

        /**
         * Move to a new path.
         * 
         * @param {string} destPath     The new path.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        moveTo(destPath: string): Promise<any>;

        /**
         * Copy to a new path.
         * 
         * @param {string} newPath      The new path.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        copyTo(newPath: string): Promise<any>;

        /**
         * Delete.
         * 
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        deleteItem(): Promise<any>;

        /**
         * Read data of a specified length sequentially.
         * 
         * @param {number} length      The length of data to write.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        readData(length: Int): Promise<any>;

        /**
         * Write local change on File.
         * 
         * @param {string} data      The data to write.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        writeData(data: any): Promise<any>;

        /**
         * Commit local change on File to backend.
         * 
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        commit(): Promise<any>;

        /**
         * Discard local change on File.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @return
         * onSuccess will be called on success.
         */
        discard(onSuccess?: ()=>void);
    }

    /**
     * The class representing Directory.
     * @class
     */
    interface Directory {
        /**
         * Get the information(ID, name, childCount) of the directory got last time.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        getLastInfo(onSuccess: (info: any)=>void, onError?: (err: string)=>void);

        /**
         * Get the information(ID, name, childCount) of the directory from the server.
         * 
         * @return
         * A promise object that contains the information(ID, name, childCount) of the file
         * will be returned on success, otherwise a promise object that contains error
         * information will be returned.
         */
        getInfo(): Promise<any>;

        /**
         * Create directory with name.
         * @param {string} name      The directory name.
         * @return
         * A directory will be returned on success, otherwise a promise object that contains
         * error information will be returned.
         */
        createDirectory(name: string): Promise<any>;

        /**
         * Get the directory with a specified name.
         * 
         * @param {string} name      The directory name.
         * @return
         * A directory will be returned on success, otherwise a promise object that contains
         * error information will be returned.
         */
        getDirectory(name: string): Promise<any>;

        /**
         * Create file with name.
         * 
         * @param {string} name      The file name.
         * @return
         * A file will be returned on success, otherwise a promise object that contains
         * error information will be returned.
         */
        createFile(name: string): Promise<any>;

        /**
         * Get the File with a specified name.
         * 
         * @param {string} name      The file name.
         * @return
         * A file will be returned on success, otherwise a promise object that contains
         * error information will be returned.
         */
        getFile(name: string): Promise<any>;

        /**
         * Get children for current directory.
         * 
         * @return
         * The children for current directory will be returned on success, otherwise
         * a promise object that contains error information will be returned.
         */
        getChildren(): Promise<any>;

        /**
         * Move to a new path.
         * 
         * @param {string} destPath     The destination path.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        moveTo(destPath: string): Promise<any>;

        /**
         * Copy to a new path.
         * 
         * @param {string} newPath      The new path.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        copyTo(newPath: string): Promise<any>;

        /**
         * Delete.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        deleteItem(): Promise<any>;
    }

    /**
     * The class representing Drive.
     * @class
     */
    interface Drive {
        /**
         * Get the information(ID) of the drive got last time.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        getLastInfo(onSuccess: (info: any)=>void, onError?: (err: string)=>void);

        /**
         * Get the information(ID) of the drive from the server.
         * 
         * @return
         * A promise object that contains the information(ID) of the file
         * will be returned on success, otherwise a promise that contains error information
         * will be returned.
         */
        getInfo(): Promise<any>;

        /**
         * Get the root directory.
         * 
         * @return
         * A directory will be returned on success, otherwise a promise that contains
         * error information will be returned.
         */
        rootDirectory(): Promise<any>;

        /**
         * Create directory with path.
         * 
         * @param {string} path      The directory path.
         * @return
         * A directory will be returned on success, otherwise a promise that contains
         * error information will be returned.
         */
        createDirectory(path: string): Promise<any>;

        /**
         * Get the directory with a specified path.
         * 
         * @param {string} path      The directory path.
         * @return
         * A directory will be returned on success, otherwise a promise that contains
         * error information will be returned.
         */
        getDirectory(path: string): Promise<any>;

        /**
         * Create file with path.
         * 
         * @param {string} path      The file path.
         * @return
         * A file will be returned on success, otherwise a promise that contains
         * error information will be returned.
         */
        createFile(path: string): Promise<any>;

        /**
         * Get the File with a specified path.
         * 
         * @param {string} path      The file path.
         * @return
         * A file will be returned on success, otherwise a promise that contains
         * error information will be returned.
         */
        getFile(path: string): Promise<any>;

        /**
         * Get the information(ID, name, size, type) of the drive with a specified path.
         * 
         * @param {string} path      The drive path.
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise that contains error information will be returned.
         */
        getItemInfo(path: string): Promise<any>;
    }

    /**
     * The class representing Client.
     * @class
     */
    interface Client {
        /**
         * Associate a user with the Client.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @param {Function} handler    The function to call.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        login(handler: Function, onSuccess?: ()=>void, onError?: (err: string)=>void);

        /**
         * Dissociate the user from the Client.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        logout(onSuccess?: ()=>void, onError?: (err: string)=>void);

        /**
         * Get the last associated user's information with client information.
         * 
         * @param {Function} onSuccess  The function to call on success.
         * @param {Function} onError    The function to call on error.
         * @return
         * onSuccess will be called on success, otherwise onError will be called.
         */
        getLastInfo(onSuccess?: (info: any)=>void, onError?: (err: string)=>void);

        /**
         * Get associated user's information with client information.
         * 
         * @return
         * A promise object that contains success information will be returned on success,
         * otherwise a promise object that contains error information will be returned.
         */
        getInfo(): Promise<any>;

        /**
         * Get the current backend's Drive instance associated with the client's drive.
         * @return
         * A drive will be returned on success, otherwise a promise object that contains
         * error information will be returned.
         */
        getDefDrive(): Promise<any>;
    }

    type driveType = {
        NATIVE: 1,
        ONEDRIVE: 2,
        IPFS: 3
    };

    interface HiveManager {
        getVersion(onSuccess?: ()=>void, onError?: (err: string)=>void);
        setListener(type: any, eventCallback: Function);
        createClient(options: any, onSuccess: (client: Client)=>void, onError?: (err: string)=>void);
    }
}