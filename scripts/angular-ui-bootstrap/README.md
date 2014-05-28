ONLY USE CUSTOM BUILD VERSIONS EXCLUDING THE 'collapse' MODULE WHEN UPDATING THE SCRIPT! (Valid for versions 0.11+)  

Explanation:  

In version 0.10 the 'modal' module was broken.  
An update to version 0.11 fixed the issue.  
Updating to version 0.11 also broke the previous 'accordion' implementation and the navigation (has nothing no do with this!).  
  
The accordion (used in the item sidebar) only threw exceptions after the update.  
Apparently now the module had to be used completely differently!  
After having a look at the new (really dirty) usage the issue could be fixed.  
  
The dropdown menus of the navigation bar had to be clicked twice after the update to version 0.11.  
The problem lies within the 'collapse' module, which interferes with the collapse usage of jquery-ui.  
  
Removing the collapse module from ui-bootstrap-tpls.js does not fix the issue, as other modules like 'accordion' depend on that module.  
  
The solution is to use the 'Create a Build' option from the website (http://angular-ui.github.io/bootstrap/) and only choose the modules that are needed (no collapse!).  
  
The version somehow shows to be 0.10 but the implementation of the 'accordion' module still is the new one from version 0.11.  

The Modal still behaves like the 0.10 one, since the 'size' attribute does not do anything (known issue in 0.10). I hardcoded the class 'modal-lg' into the modal directive since it is only used at one point of the project as of the time of writing this.  

I don't get this project...  
