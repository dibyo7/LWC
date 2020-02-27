public with sharing class DynamicFieldRetrieve {
    @AuraEnabled(cacheable=true)
    public static List<SObject> fieldRetrieve(String objectName, String fieldAPINames) {
        List<String> fNames = (List<String>) System.JSON.deserialize(fieldAPINames, List<String>.class);
        System.debug(fNames);
        String strQuery = '';
        String finalQuery = '';
        //System.debug(fieldNames);
        for(String i : fNames){
            //System.debug(i);
             strQuery = strQuery + i + ',';
            //System.debug(strQuery);
        }
        
        //System.debug(strQuery);
        strQuery = strQuery.replaceAll(',$','');
        finalQuery = 'SELECT ' + strQuery + ' FROM ' + objectName + ' LIMIT 20';
        //System.debug(finalQuery);
        return database.query(finalQuery);
        

    }
}