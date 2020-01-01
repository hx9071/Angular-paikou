import { Injectable, Component, OnInit } from '@angular/core';
import { PickerController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PickerService {

  constructor(
    public pickercontroller: PickerController,
  ) { }
  async openPicker(numColumns = 1, numOptions = 5, multiColumnOptions, callback) {
    const picker = await this.pickercontroller.create({
        columns: this.getColumns(numColumns, numOptions, multiColumnOptions),
        buttons: [
            {
                text: '取消',
                role: 'cancel'
            },
            {
                text: '确定',
                handler: value => {
                    // console.log(`Got Value ${value}`);
                    callback(JSON.stringify(value)) ;
                }
            }
        ]
    });
    await picker.present();
}
/**
 * @param numColumns 得到每一列的值
 * @param numOptions 长度
 * @param columnOptions 选项的值
 */
getColumns(numColumns, numOptions, columnOptions) {
    let columns ;
    columns = [];
    for (let i = 0; i < numColumns; i++) {
        columns.push({
            name: `col-${i}`,
            options: this.getColumnOptions(i, numOptions, columnOptions)
        });
    }
    return columns;
}
getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options ;
    options = [];
    for (let i = 0; i < numOptions; i++) {
        options.push({
            text: columnOptions[columnIndex][i % numOptions],
            // value: i,
            value: columnOptions[1][i % numOptions],
        });
        // console.log( options[i].text, options.value, 'value');
    }
    console.log( options , 'options****');
    return options;
}
}
