import { LightningElement, wire, track } from 'lwc';
import getContactList from '@salesforce/apex/ContactController.getContactList';
import {updateRecord} from 'lightning/uiRecordApi';
import {refreshApex} from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
/*import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import ID_FIELD from '@salesforce/schema/Contact.Id';
*/
const COLS = [
    { label: 'First Name', fieldName: 'FirstName', type: 'string', editable: true },
    { label: 'Last Name', fieldName: 'LastName', type: 'string', editable: true},
    { label: 'Title', fieldName: 'Title', editable:true},
    { label: 'Phone', fieldName: 'Phone', editable: true},
    { label: 'Email', fieldName: 'Email', editable: true}

];
export default class Datatable4practice extends LightningElement {
    @track error;
    @track columns = COLS;
    @track draftValues = [];

    @wire(getContactList)
    contact;

    handleSave(event) {
        const recordInputs =  event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
            
        });
        
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(contacts => {
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
             return refreshApex(this.contact);
        }).catch(error => {
            // Handle error
        });
    }


}
