import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
@Injectable({
  providedIn: 'root'
})
export class FiletransferService {

  constructor(
    private transfer: FileTransfer,
    private file: File,
  ) { }
  /**
   * 文件上传
   * @param url 文件上传的服务器地址
   * @param fllePath 文件在本地存放的路径
   * @param fileParams 文件上传时带的参数
   * @param callback 回调函数
   */
  fileUpload(url, fllePath, fileParams, callback) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: fileParams.fileKey,
      fileName: fileParams.fileName,
      httpMethod: 'post',
      mimeType: fileParams.mimeType,
      headers: {},
      params: fileParams.params
    };

    console.log('参数', options );

    fileTransfer.upload(fllePath, url, options)
      .then((res) => {
        callback(res);
      }, (err) => {
        callback('error');
      });
  }
}
