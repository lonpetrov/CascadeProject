function CascadeStruct(name) {
	if (debugMode) {
		let msg = 'CÓÁ‰‡Ì Ó·˙ÂÍÚ: ';
		Debugging(msg + name, "#FF0000");
    }
	this.models = [];

}

CascadeStruct.prototype.Cascade = function () {

	if (pfcIsMozilla())
		netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");

	var session = pfcGetProESession();
	var assembly = session.CurrentModel;
	var modelTypeClass = pfcCreate("pfcModelType");

	if (assembly == void null || assembly.Type != modelTypeClass.MDL_ASSEMBLY) {
		throw new Error(0, "Current model is not an assembly.");
	}

	Debugging("begin");

	this.GetTreeCascade(assembly, session);
	let unique = this.GetUniqueModels(this.models);
	let specs = this.GetFlexSpecItems(unique);
	Debugging('Models: ' + this.models.length + ' - Unique: ' + unique.length);

	for (var i = 0; i < specs.length; i++) {
		Debugging(specs[i].InstanceName);
	}

	//let tree = new Tree('CEO');
	//tree.add('VP of Happines', 'CEO', tree.traverseBF);
	//tree.add('VP of Finance', 'CEO', tree.traverseBF);
	//tree.add('VP of Sadness', 'CEO', tree.traverseBF);
	//tree.add('Director of Puppies', 'VP of Finance', tree.traverseBF);
	//tree.add('Manager of Puppies', 'Director of Puppies', tree.traverseBF);

	//tree.traverseDF(function (node) {
	//	Debugging(node.data);
	//});

	Debugging("end");
}

//get all items that have to be changed (materials, parts, assemlbies)
CascadeStruct.prototype.GetFlexSpecItems = function (list) {
	paramValueType = pfcCreate("pfcParamValueType");
	let specItems = [];
	for (var i = 0; i < list.length; i++) {
		let value = list[i].GetParam("–¿«ƒ≈À_—œ≈÷").GetScaledValue();
		if ((value.discr === paramValueType.PARAM_STRING)) {
			if (value.StringValue === "ƒ≈“¿À»" || value.StringValue === "Ã¿“≈–»¿À€" || value.StringValue === "—¡Œ–Œ◊Õ€≈ ≈ƒ»Õ»÷€") {
				//Debugging(list[i].InstanceName + " - " + value.StringValue);
				specItems.push(list[i]);
			}
		}
	}
	return specItems;
}

//Gets Unique Models
CascadeStruct.prototype.GetUniqueModels = function (list) {
	let result = [];
	for (let i = 0; i < list.length; i++) {
		if (result.indexOf(list[i]) === -1) {
			result.push(list[i]);
		}
	}
	return result;
}

//Deletes retrieved models from collecton
CascadeStruct.prototype.FlushRetrievedModels = function () {
	this.models = [];
}

//gets two lists of active! models
CascadeStruct.prototype.GetTreeCascade = function (assembly, session) {
	var self = this;
	var modelTypeClass = pfcCreate("pfcModelType");
	var featureStatus = pfcCreate("pfcFeatureStatus");
	var components = assembly.ListFeaturesByType(false, pfcCreate("pfcFeatureType").FEATTYPE_COMPONENT);

	for (var i = 0; i < components.Count; i++) {
		var component = components.Item(i);//pfcFeature
		var desc = component.ModelDescr;
		let status = component.Status;

		if (desc.Type == modelTypeClass.MDL_ASSEMBLY && status == featureStatus.FEAT_ACTIVE) {
			var assemblyModel = session.GetModelFromDescr(desc);
			//Debugging('Asm: ' + assemblyModel.Type + ' ' + assemblyModel.InstanceName + ' ' + status);
			this.models.push(assemblyModel);
			self.GetTreeCascade(assemblyModel, session);
		}
		else if (desc.Type == modelTypeClass.MDL_PART && status == featureStatus.FEAT_ACTIVE) {
			var partModel = session.GetModelFromDescr(desc);
			//Debugging('Part: ' + partModel.Type + ' ' + partModel.InstanceName + ' ' + status);
			this.models.push(partModel);
		}

	}
}

//Adds rows to family table
CascadeStruct.prototype.AddNewRow = function (partModel, name) {
	var nameOfInst = "new_inst";
	try {
		var newInstanceOfPartModel = partModel.AddRow(nameOfInst, null);
	}
	catch (err) {

		var error = pfcGetExceptionType(err);
		if (error == "pfcXToolkitFound") {
			alert('U: ' + error);
			/* counter++;
			nameOfInst = nameOfInst +'-'+counter;  
			var newInstanceOfPartModel = partModel.AddRow(nameOfInst, null); */
		}
	}
	//alert(newInstanceOfPartModel.InstanceName);
}

//Makes list from Models
CascadeStruct.prototype.MakeListFromModels = function (models) {
	let out = [];
	for (let i = 0; i < models.Count; i++) {
		out.push(models.Item(i));
	}
	return out;
}

//Gets list of InstanceName of Parts
CascadeStruct.prototype.GetInstanceNames = function (list) {
	let result = [];
	for (let i = 0; i < list.length; i++) {
		result.push(list[i].InstanceName);
	}
	return result;
}