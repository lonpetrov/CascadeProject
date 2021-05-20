let modelsOfAssemblies = [];
let modelsOfParts = [];

function Cascade() {
	
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var assembly = session.CurrentModel;
    var modelTypeClass = pfcCreate("pfcModelType");
	//var modelItemType = pfcCreate("pfcModelItemType");

	if (assembly == void null || assembly.Type != modelTypeClass.MDL_ASSEMBLY)
    {
      throw new Error  (0, "Current model is not an assembly.");
	  alert("Error");
    }
	
	 alert("begin");
		GetTreeCascade(assembly, session);
		alert('assemblies '+ modelsOfAssemblies.length+ ' = ' + GetUniqueModels(modelsOfAssemblies).length);
		alert('parts '+ modelsOfParts.length + ' = ' + GetUniqueModels(modelsOfParts).length);

	 alert("end");
}

function GetUniqueModels(list){
	let result = [];
	for (let i = 0; i < list.length; i++){
		if (result.indexOf(list[i]) === -1){
			result.push(list[i]);
			//alert('!');	
		}
	}		
	return result;
}


//Deletes retrieved models from collecton
function FlushRetrievedModels(){
	modelsOfAssemblies = [];
	modelsOfParts = [];
	
}
//gets two lists of models
function GetTreeCascade(assembly, session){
	var modelTypeClass = pfcCreate("pfcModelType");
	var components = assembly.ListFeaturesByType(false, pfcCreate ("pfcFeatureType").FEATTYPE_COMPONENT); 

 for(var i=0;i<components.Count;i++)
	 {
		  var component = components.Item(i);
		  var desc = component.ModelDescr;

		  if(desc.Type == modelTypeClass.MDL_ASSEMBLY)
		  {
			  //alert('Asm: ' + desc.Type + ' ' + desc.InstanceName);
			  var assemblyModel = session.GetModelFromDescr(desc);
			  modelsOfAssemblies.push(assemblyModel);
			  GetTreeCascade(assemblyModel, session);	
			  
		  }
		  else if(desc.Type == modelTypeClass.MDL_PART)
		  {
			//alert('Part: ' + desc.Type + ' ' + desc.InstanceName);
			var partModel = session.GetModelFromDescr(desc);
			modelsOfParts.push(partModel);
			
		  }
		  
	 }
 }
 
 function AddNewRow(partModel,name){
	var nameOfInst = "new_inst";
			try
			{
				var newInstanceOfPartModel = partModel.AddRow(nameOfInst, null);
			}
			catch(err)
			{
				
				var error = pfcGetExceptionType(err);
				if(error == "pfcXToolkitFound")
				{
					alert('U: ' + error);
					/* counter++;
					nameOfInst = nameOfInst +'-'+counter;  
					var newInstanceOfPartModel = partModel.AddRow(nameOfInst, null); */
				}
			}
			//alert(newInstanceOfPartModel.InstanceName);
}

//Makes list from Models
function MakeListFromModels(models){
	let out = [];
	for(let i = 0; i < models.Count; i++){
		out.push(models.Item(i));
	}
	return out;
}
//Gets list of InstanceName of Parts
function GetInstanceNames(list){
	let result = [];
	for (let i = 0; i < list.length; i++){
		result.push(list[i].InstanceName);
	}
	return result;
}