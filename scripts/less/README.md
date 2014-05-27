WARNING: THIS LESS VERSION IS CUSTOMIZED!
  
Customized part:  
    // Load styles asynchronously (default: false)
    //
    // This is set to 'false' by default, so that the body
    // doesn't start loading before the stylesheets are parsed.
    // Setting this to 'true' can result in flickering.
    //
    less.async = true;
    less.fileAsync = true;  
	
When .less files are precompiled in the future, this kan be ignored, until then: set `less.async` and `less.fileAsync` to `true`. This is because chrome packaged apps don't like synchronous stuff at all and I failed to set the attributes in a script.