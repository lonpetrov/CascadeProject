let modelsOfAssemblies = [];
let modelsOfParts = [];
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
	  alert("Error");
    }
	
	//alert("begin");
	Debugging("begin");

	GetTreeCascade(assembly, session);
	let uniqueParts = GetUniqueModels(modelsOfParts);
	let uniqueAssemblies = GetUniqueModels(modelsOfAssemblies);

	//let i = uniqueParts[0].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().StringValue;
	//let i = uniqueParts[0].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().discr;
	//GetFlexSpecItems(uniqueParts);
	//GetFlexSpecItems(uniqueAssemblies);
	//alert('assemblies '+ modelsOfAssemblies.length + ' = ' + GetUniqueModels(modelsOfAssemblies).length);
	//alert('parts ' + modelsOfParts.length + ' = ' + GetUniqueModels(modelsOfParts).length);

	//for (var i = 0; i < uniqueParts.length; i++) {
	//	alert(uniqueParts[i].InstanceName + ' ' + uniqueParts[i].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().StringValue)
	//	alert(uniqueParts[i].Descr.Type);
	//}
	//for (var i = 0; i < uniqueAssemblies.length; i++) {
	//	alert(uniqueAssemblies[i].InstanceName + ' ' + uniqueAssemblies[i].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().StringValue)
	//}

	//alert("end");
	Debugging("end");
}

//get all items that have to be changed (materials, parts, assemlbies)
function GetFlexSpecItems(list) {
	paramValueType = pfcCreate("pfcParamValueType");
    for (var i = 0; i < list.length; i++) {
		if ((list[i].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().discr === paramValueType.PARAM_STRING)) {
			if (list[i].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue().StringValue === "—¡Œ–Œ◊Õ€≈ ≈ƒ»Õ»÷€" || "ƒ≈“¿À»" || "Ã¿“≈–»¿À€" ) {
				alert(list[i].InstanceName + "!!!!");
            }
		}
    }
	
}

function Debugging(note) {
	counter++;
	let newElem = document.createElement("h4");
	const text = document.createTextNode(counter+': '+ note);
	newElem.appendChild(text);
	
	document.body.appendChild(newElem);
}

//Gets Unique Models
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
		  var component = components.Item(i);//pfcFeature - ÚËÔ ‰‡ÌÌÓÈ
	 var desc = component.ModelDescr;
	 let feat = component.Status


		  if(desc.Type == modelTypeClass.MDL_ASSEMBLY)
		  {
			  //alert('Asm: ' + desc.Type + ' ' + desc.InstanceName);
			  var assemblyModel = session.GetModelFromDescr(desc);
			  //alert('Asm: ' + assemblyModel.Type + ' ' + assemblyModel.InstanceName);
			  Debugging('Asm: ' + assemblyModel.Type + ' ' + assemblyModel.InstanceName + ' ' + feat);
			  modelsOfAssemblies.push(assemblyModel);
			  GetTreeCascade(assemblyModel, session);	
			  
		  }
		  else if(desc.Type == modelTypeClass.MDL_PART)
		  {
			  //alert('Part: ' + desc.Type + ' ' + desc.InstanceName);
			  var partModel = session.GetModelFromDescr(desc);
			  //alert('Part: ' + partModel.Type + ' ' + partModel.InstanceName)
			  Debugging('Part: ' + partModel.Type + ' ' + partModel.InstanceName + ' ' + feat);
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