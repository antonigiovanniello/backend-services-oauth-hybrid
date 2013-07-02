function getParameterByName(name, url) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = name + "=([^&#]*)";
 			
	console.log("Parameter name: " + name);
	console.log("Url: " + url);
            
	var regex = new RegExp(regexS);
	var results = regex.exec(url);
            
	console.log("Result: " + results);
            
	if (results == null) {
		return false;
	}
	else 
		return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var IdentityProvider = function (config) {
	var that = this;
    
	this.getAccessToken = function(callback) {
		console.log("Begin authorization with: " + config.providerName);
		// Begin Authorization
		var authorize_url = config.endpoint
							+ "?response_type=" + config.response_type
							+ "&client_id=" + config.client_id
							+ "&redirect_uri=" + config.redirect_uri
							+ "&display=" + config.display
							+ "&access_type=" + config.access_type
							+ "&scope=" + config.scope
   
		//CALL IN APP BROWSER WITH THE LINK
		ref = window.open(authorize_url, '_blank', 'location=no');
		console.log(authorize_url)
        
		console.log("Attaching loadstart event")
		ref.addEventListener('loadstart', function(event) {
			console.log("loadstart event handler")
			that.facebookLocChanged(event.url, callback);
		});
        
		console.log("Attaching loadstop event")
		ref.addEventListener('loadstop', function(event) {
			console.log("loadstop event handler")
			that.locationChanged(event.url, callback);
		});
	}
    
	this.locationChanged = function(loc, callback) {
		console.log("Current location: " + loc)
		if (loc.indexOf("access_token=") != -1) {
			ref.close();
			console.log(loc);
			var token = getParameterByName("access_token", loc);
            
            callback(token);
		} else {
            console.log("No access_token in url.")
        }
	}
}