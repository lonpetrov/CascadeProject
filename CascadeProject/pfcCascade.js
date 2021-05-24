let modelsOfAssemblies = [];
let modelsOfParts = [];
let debugMode = true;
let counter = 0;


function Cascade() {
	
    if (pfcIsMozilla())
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

    var session = pfcGetProESession();
    var assembly = session.CurrentModel;
	var modelTypeClass = pfcCreate("pfcModelType");

	if (assembly == void null || assembly.Type != modelTypeClass.MDL_ASSEMBLY)
    {
      throw new Error  (0, "Current model is not an assembly.");
    }
	
	Debugging("begin");

	GetTreeCascade(assembly, session);
	let uniqueParts = GetUniqueModels(modelsOfParts);
	let uniqueAssemblies = GetUniqueModels(modelsOfAssemblies);

	//GetFlexSpecItems(uniqueParts);
	//GetFlexSpecItems(uniqueAssemblies);

	Debugging('assemblies ' + modelsOfAssemblies.length + ' = unique ' + GetUniqueModels(modelsOfAssemblies).length);
	Debugging('parts ' + modelsOfParts.length + ' = unique ' + GetUniqueModels(modelsOfParts).length);

	Debugging("end");
}

//get all items that have to be changed (materials, parts, assemlbies)
function GetFlexSpecItems(list) {
	paramValueType = pfcCreate("pfcParamValueType");
	let specItems = [];
	for (var i = 0; i < list.length; i++) {
		let value = list[i].GetParam("ÐÀÇÄÅË_ÑÏÅÖ").GetScaledValue();
		if ((value.discr === paramValueType.PARAM_STRING)) {
			if (value.StringValue === "ÄÅÒÀËÈ" || value.StringValue === "ÌÀÒÅÐÈÀËÛ" || value.StringValue === "ÑÁÎÐÎ×ÍÛÅ ÅÄÈÍÈÖÛ") {
				//Debugging(list[i].InstanceName + " - " + value.StringValue);
				specItems.push(list[i]);
            }
		}
	}
	return specItems;
}

function Debugging(note) {
	if (debugMode) {
		counter++;
		let newElem = document.createElement("h4");
		const text = document.createTextNode(counter + ': ' + note);
		newElem.appendChild(text);
		document.body.appendChild(newElem);
	}
}

//Gets Unique Models
function GetUniqueModels(list){
	let result = [];
	for (let i = 0; i < list.length; i++){
		if (result.indexOf(list[i]) === -1){
			result.push(list[i]);
		}
	}		
	return result;
}

//Deletes retrieved models from collecton
function FlushRetrievedModels(){
	modelsOfAssemblies = [];
	modelsOfParts = [];
}

//gets two lists of active! models
function GetTreeCascade(assembly, session){
	var modelTypeClass = pfcCreate("pfcModelType");
	var featureStatus = pfcCreate("pfcFeatureStatus");
	var components = assembly.ListFeaturesByType(false, pfcCreate ("pfcFeatureType").FEATTYPE_COMPONENT); 

	for (var i = 0; i < components.Count; i++)
	{
		var component = components.Item(i);//pfcFeature
		var desc = component.ModelDescr;
		let status = component.Status;

		if (desc.Type == modelTypeClass.MDL_ASSEMBLY && status == featureStatus.FEAT_ACTIVE)
		{
			var assemblyModel = session.GetModelFromDescr(desc);
			//Debugging('Asm: ' + assemblyModel.Type + ' ' + assemblyModel.InstanceName + ' ' + status);
			modelsOfAssemblies.push(assemblyModel);
			GetTreeCascade(assemblyModel, session);	  
		  }
		else if (desc.Type == modelTypeClass.MDL_PART && status == featureStatus.FEAT_ACTIVE)
		{
			var partModel = session.GetModelFromDescr(desc);
			//Debugging('Part: ' + partModel.Type + ' ' + partModel.InstanceName + ' ' + status);
			modelsOfParts.push(partModel);
		  }
		  
	 }
}

 //Adds rows to family table
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