#Intro to ASP.NET MVC

##Overview

###What is MVC?


Model–view–controller (MVC) is a software architecture pattern that separates the representation of information from the user's interaction with it. 

The model consists of application data, business rules, logic, and functions. A view can be any output representation of data, such as a chart or a diagram... The controller mediates input, converting it to commands for the model or view.
[wikipedia](http://en.wikipedia.org/wiki/Model-view-controller)


###What is ASP.NET MVC?
ASP.NET MVC is a framework built on top of ASP.NET that provides developers with an alternative method of building web applications.

###Why does ASP.NET MVC exist?

ASP.NET MVC was not the first MVC web development framework, even for ASP.NET, and many other MVC frameworks already exist in other languages
- Java has [Spring MVC](http://www.springsource.org/), and a multitude of frameworks exist in other languages like python, php, node, etc. 

In 2005, [Ruby on Rails](http://rubyonrails.org/) provided an "opinionated" web development stack that aimed to make web development better and became extremely popular.

ASP.NET MVC was first released in 2009.  The first version, along with subsequent updates and tools borrowed many ideas and philosophies from the frameworks that preceded it:

- routing
- convention over configuration
- emphasis on patterns intended to create de-coupled systems
- better view template engine with v3+ ([razor](http://weblogs.asp.net/scottgu/archive/2010/07/02/introducing-razor.aspx))
- scaffolding
- finally embraced important software principles -> dependency injection!
- MVC is fully pluggable - pieces of the framework can be swapped out and replaced with alternative implementations (ControllerFactory, DependencyResolver, view engine, etc.)

###Why use it?
The programming paradigm in MVC maps closer to how the web actually works than ASP.NET web forms.  ASP.NET Web Forms' model of using postbacks to simulate event handling on the server attempts to abstract the details of the web away and make programming for the web more similar to writing desktop applications. But the web doesn't have click events...

ASP.NET MVC emphasizes a separation of concerns and focuses on giving finer control back to the developer over things like:

- HTML rendered
- HTTP Verbs handled - explicitly handle GETs vs POSTs
- Response type (JSON, HTML, etc.)

ASP.NET MVC also allows for the generation of skeleton applications extremely quickly. Using features like scaffolding, one can quickly generate default views (list, details, edit, create, etc). This enables developers to build the simplest thing quickly and then iterate, getting working software in front of users as quickly as possible.


###Models (Putting the M in MVC)
*Models* are typically your data, your entities, your domain objects. Things like:

- Employee
- LeaveRequest
- Role
- Project
- Company

These can be POCO objects, DTOs, classes of some sort. It really doesn't matter where they come from. All that matters is that they exist. They are after all, the heart of your application.

###Views (They put the V in MVC)
A *view* is used to define what content is rendered to the user for a specific request. In a  MVC application, these are typically stored and organized into subfolders in the ~/Views folder. 
A view stored at ~/Views/Home/Index.cshtml would typically be rendered for the request /Home/Index (or /Home when index is the default).

Views can be strongly typed:
- this means that a specific model class type can be associated with the view
- the view has access to an object, Model, of the specified type

###Controllers (Yup, the C)
*Controllers* are defined to handle incoming requests and demonstrate the philosophy of *convention over configuration*.
- When ASP.NET MVC handles an incoming request, such as /Account/Login, using the default routing configuration, it will expect that a controller exists named AccountController, which has a method (action) called Login.

Actions are expected to return something that inherits from ActionResult:

- ViewResult - ex. return View(), return View("SpecificViewName")
- JsonResult - ex. return Json(object)
- RedirectToRouteResult - redirect the request to another action
- ContentResult, FileContentResult, etc.
- A custom extension of ActionResult or one of it's children


###Putting the M,V,and C together
For example, if we were to create a simple class like this:

     public class WelcomeModel
     {
        public string Message { get; set; }
     }
    
... create a view at ~/Home/Index.cshtml like this: 

    @model SampleApp.Models.WelcomeModel
    @{
        ViewBag.Title = "Welcome Page";
    }
    <h3>Welcome</h3>
    <p>
        @Model.Message
    </p>

... and ensure that our HomeController has an action named Index and returns a view using model type:

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View(new WelcomeModel(){Message = "Hello there."});
        }
    }

navigating to our web app in a browser at the URL /Home/Index, we should see our message "Hello there." displayed as our request was routed to the appropriate action which responded with our view content.


###Routing

*Routing* is what is used to map requests to controllers, actions, and their parameters.
On creating an ASP.NET MVC app, the default configuration contains something like : 

   

      routes.MapRoute(
          name: "Default",
          url: "{controller}/{action}/{id}",
          defaults: new { controller = "Home", 
          action = "Index", id = UrlParameter.Optional }
      );
     
This is essentially telling the routing engine how to parse incoming requests. 
An incoming request should have 3 parts:

- the name of a controller
- the name of an action
- and an id, which is specified as optional

Additionally, this configuration defines the HomeController and the Index action as the default.  Therefore, if no controller or action was specified, we will return the result of the HomeController.Index method.

The default routing can be changed, and additional, more specific routes can be added. They are evaluated in order, so it is advisable to define more specific routes first, followed by more general ones.

When rendering views server-side, using a view engine, it is advisable to use the built in Html Helpers, such as [@Html.ActionLink](http://stackoverflow.com/questions/200476/html-actionlink-method), or [@Url.Action](http://stackoverflow.com/questions/1759189/how-does-url-action-work-asp-net-mvc) when rendering links. These are aware of routing and will render the appropriate URL, depending on how your routes are defined. If these are used, you can freely change your routes without breaking your application.

###Bundling
In ASP.NET 4, we now have a feature called *bundling*.  Bundling allows us to concatenate and minify CSS and script files automatically when the application starts. Bundling is aware of the build mode and will:

- concat+minify when in RELEASE
- individual script/link tags will be added to the page when in DEBUG mode

[bundling and minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification)

###Action Filters
Custom attributes can be defined that inherit from ActionFilterAttribute.
This allows us to "inject" some code to run before or after an action is run.
Could be used for things like:

- authorization
- audit logging
- transforming/injecting parameters values
- caching
- ? use your imagination

[action filters](http://bit.ly/XnqSWI)

###Display and Editor Templates
Templates can be defined for specific server-side types. This allows us to create re-usable pieces of HTML that can be automatically injected into views when we need to render instances of those types.

For example, consider the type DateTime:
- a display template could be a span containing the formatted time text
- an editor template could be an input box with a datepicker

Display and editor templates are typically added to the folders ~/Views/Shared/DisplayTemplates and ~/Views/Shared/EditorTemplates, respectively.

In views, templates can be used by using the appropriate Html helpers and passing in the instance that we want to render:

- @Html.DisplayFor(model=>model.Date)
- @Html.EditorFor(model=>model.Date)

[example](http://www.growingwiththeweb.com/2012/12/aspnet-mvc-display-and-editor-templates.html)

###Web API
An API for creating HTTP services, targeted toward building RESTful applications:

- similar to MVC, Web API also has a similar route configuration
- handles GET, POST, PUT, DELETE verbs via convention, uses parameter namign for method resolution
- good support for JSON serialization, deserializing objects passed from client

Web API works extremely well within an ASP.NET MVC web application and allows creation of an "API" or service that provides access to model data - create, edit, delete, list, etc.

Using within an MVC application allows a nice separation between requests that serve pages, and requests that should serve data.

###Recommended Tools

- Visual Studio 2012
- nuget
- ELMAH
- smtp4dev
- Mindscape Web Workbench
- reSharper
- ncrunch or mighty moose
- jenkins
