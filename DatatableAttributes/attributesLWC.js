import { LightningElement, api, track, wire } from 'lwc';
import fieldRetrieve from '@salesforce/apex/DynamicFieldRetrieve.fieldRetrieve';
import {updateRecord} from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

let i = 0;
let k = 0;

export default class AttributesLWC extends LightningElement {
    @api jsonStr = '';
    @track error;
    @track draftValues = [];
    @track cols;
    @track keyValue = [];
    @track fieldLabels = [];
    @track fieldAPInames = [];
    @track editables= []; 
    
    @api objectName = 'Account';
    @api totalFields = 4;

    //default values for lightning app builder configuration
    //variables can be changed in app builder as per requirements
    @api label1 = 'label1';
    @api label2 = 'label2';
    @api label3 = 'label3';
    @api label4 = 'label4';
    @api label5 = 'label5';
    @api label6 = 'label6';
    @api label7 = 'label7';
    @api label8 = 'label8';

    @api field1 = 'field1';
    @api field2 = 'field2';
    @api field3 = 'field3';
    @api field4 = 'field4';
    @api field5 = 'field5';
    @api field6 = 'field6';
    @api field7 = 'field7';
    @api field8 = 'filed8';

    @api editable1 = false;
    @api editable2 = false;
    @api editable3 = false;
    @api editable4 = false;
    @api editable5 = false;
    @api editable6 = false;
    @api editable7 = false;
    @api editable8 = false;
  
    if(totalFields){
        //this.fieldAPInames = [];
        //this.fieldLabels = [];
        //this.editables = [];

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
        
    }
    cols = this.keyValue;
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
