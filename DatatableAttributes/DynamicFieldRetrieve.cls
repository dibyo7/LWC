public with sharing class DynamicFieldRetrieve {
    @AuraEnabled(cacheable=true)
    public static List<SObject> fieldRetrieve(String objectName, String fieldAPINames) {
        
        List<String> fNames = (List<String>) System.JSON.deserialize(fieldAPINames, List<String>.class);
        String strQuery = '';
        String finalQuery = '';
        for(String i : fNames){   
             strQuery = strQuery + i + ',';   
        } 
        strQuery = strQuery.replaceAll(',$','');
        finalQuery = 'SELECT Id,' + strQuery + ' FROM ' + objectName + ' LIMIT 20';
        return database.query(finalQuery);
    }
}
