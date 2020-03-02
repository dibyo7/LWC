import { LightningElement, api, track, wire } from 'lwc';
import fieldRetrieve from '@salesforce/apex/DynamicFieldRetrieve.fieldRetrieve';
import {updateRecord} from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

let i = 0;
//let k = 0;
let j = 0;
let m = 0;
let n = 0;


export default class AttributesLWC extends LightningElement {

    fL = [];
    fAPI = [];
    edit = [];
    keyValue = [];
    jsonStr = '';
    @track error;
    @track draftValues = [];
       
    @api objectName = 'Contact';
    @api totalFields = 4;

    @api label1 = 'First Name';
    @api label2 = 'Last Name';
    @api label3 = 'Title';
    @api label4 = 'Phone';
    @api label5 = 'Email';
    @api label6 = 'label6';
    @api label7 = 'label7';
    @api label8 = 'label8';

    if(totalFields){
        this.fL = [];
        for(j = 1; j <= this.totalFields; j++){
            labelVar = eval('label' + j);
            this.fL.push(labelVar);
        }
    }
    @track fieldLabels = this.fL;

    @api field1 = 'FirstName';
    @api field2 = 'LastName';
    @api field3 = 'Title';
    @api field4 = 'Phone';
    @api field5 = 'Email';
    @api field6 = 'field6';
    @api field7 = 'field7';
    @api field8 = 'filed8';
    
    if(totalFields){
        this.fAPI = [];
        for(m = 1; m <= this.totalFields; m++){
            fieldVar = eval('field' + m);
            this.fAPI.push(fieldVar);
        }
    }
    @track fieldAPInames = this.fAPI;

    @api editable1 = false;
    @api editable2 = false;
    @api editable3 = false;
    @api editable4 = false;
    @api editable5 = false;
    @api editable6 = false;
    @api editable7 = false;
    @api editable8 = false;

    if(totalFields){
        this.edit = [];
        for(n = 1; n <= this.totalFields; n++){
            editVar = eval('editable' + n);
            this.edit.push(editVar);
        }
    }
    @track editables = this.edit; 
    
    if(totalFields){
        this.keyValue = [];
        for(i = 0; i < this.totalFields; i++){
            this.keyValue.push({ label: this.fieldLabels[i], fieldName: this.fieldAPInames[i], editable: this.editables[i]});
        }
    }
    @track colms = this.keyValue;
    /*if(totalFields){
        this.fieldAPInames = [];
        this.fieldLabels = [];
        this.editables = [];
        this.keyValue = [];

        for(k = 1; k <= this.totalFields; k++){
            labelVar = eval('label' + k);
            this.fieldLabels.push(labelVar);
        
            fieldVar = eval('field' + k);
            this.fieldAPInames.push(fieldVar);
            
            editVar = eval('editable' + k);
            this.editables.push(editVar);
        }
   
        for(i = 0; i < this.totalFields; i++){
            this.keyValue.push({ label: this.fieldLabels[i], fieldName: this.fieldAPInames[i], editable: this.editables[i]});
        }   
        
    }*/
    jsonStr = JSON.stringify(this.fieldAPInames);
        
    @wire(fieldRetrieve,{objectName: '$objectName', jsonStr: '$jsonStr'})
    retrievedData;

    handleSave(event){
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };                
        });
            
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(objRecords => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contacts updated',
                    variant: 'success'
                })
            );
            // Clear all draft values
            this.draftValues = [];        
            // Display fresh data in the datatable
            return refreshApex(this.retrievedData);
        }).catch(error => {
            // Handle error
        });
        
    }

}

