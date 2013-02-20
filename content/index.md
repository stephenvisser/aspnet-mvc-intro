#Intro to ASP.NET MVC


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
- MVC is fully pluggable - pieces of the framework can be swapped out and replaced with alternative implementations (ControllerFactory, DependencyResolver, view engine, etc.)
- finally embraced important software principles like... -> [dependency injection](http://en.wikipedia.org/wiki/Dependency_injection)!
- design with testing in mind - dependencies throughout can be mocked and fully tested
- validation (client side and server side, respecting [DataAnnotations](http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.aspx))

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
- maybe a service wrapper, maybe a repository, you decide how to organize your app

These can be POCO objects, DTOs, classes of some sort. It really doesn't matter where they come from. All that matters is that they exist. They are after all, the heart of your application.

###Views (They put the V in MVC)
A *view* is used to define what content is rendered to the user for a specific request. In a  MVC application, these are typically stored and organized into subfolders in the ~/Views folder. 
A view stored at ~/Views/Home/Index.cshtml would typically be rendered for the request /Home/Index (or /Home when index is the default).

Views can be strongly typed:
- this means that a specific model class type can be associated with the view
- the view has access to an object, Model, of the specified type
Can also use dynamic objects such as the ViewBag to pass values to the view.

###Controllers (Yup, the C)
*Controllers* are defined to handle incoming requests and demonstrate the philosophy of *convention over configuration*.
- When ASP.NET MVC handles an incoming request, such as /Account/Login, using the default routing configuration, it will expect that a controller exists named AccountController, which has a method (action) called Login.

Actions are expected to return something that inherits from [ActionResult](http://bit.ly/UHXspS):

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
    <h3>ViewBag.HeaderMessage</h3>
    <p>
        @Model.Message
    </p>


... and ensure that our HomeController has an action named Index and returns a view using model type:

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.HeaderMessage = "Welcome";
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

The default routing can be changed and additional, more specific routes can be added. They are evaluated in order, so it is advisable to define more specific routes first, followed by more general ones.

When rendering views server-side, using a view engine, it is advisable to use the built in Html Helpers, such as [@Html.ActionLink](http://stackoverflow.com/questions/200476/html-actionlink-method), or [@Url.Action](http://stackoverflow.com/questions/1759189/how-does-url-action-work-asp-net-mvc) when rendering links. These are aware of routing and will render the appropriate URL, depending on how your routes are defined. If these are used, you can freely change your routes without breaking your application.

[routing overview](http://www.asp.net/mvc/tutorials/older-versions/controllers-and-routing/asp-net-mvc-routing-overview-cs)

###Bundling
In ASP.NET 4, we now have a feature called *bundling*.  Bundling allows us to concatenate and minify CSS and script files automatically when the application starts. Bundling is aware of the build mode and will:

- concat+minify when in RELEASE
- individual script/link tags will be added to the page when in DEBUG mode

Defining a bundle (typically in ~/App_Start/BundleConfig.cs):

    bundles.Add(new StyleBundle("~/Content/css")
          .Include("~/Content/site.css", "~/Content/site2.css"));

Using a bundle in a view:

    @Styles.Render("~/Content/css")



[bundling and minification](http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification)

###Validation
ASP.NET MVC has first-class support for validation. Using data annotations to decorate model classes, it is possible to propagate validation and error messages through and auto-generate client-side validation using libraries like jQuery validation.

Models submitted to the server can be validated easily using the ModelState object, which is part of the Controller class.

    [HttpPost]
    public ActionResult CreateItem(MyModel submittedModel)
    {
      if(ModelState.IsValid)
      {
        //handle..save to db or something
        return Redirect("/");
      }
      //invalid.. oh no! redisplay view with errors
      return View(submittedModel);
    }

[example](http://weblogs.asp.net/scottgu/archive/2010/01/15/asp-net-mvc-2-model-validation.aspx)

###Action Filters
Custom attributes can be defined that inherit from FilterAttribute.
These allow us to "inject" some code to run before or after an action is run.
Could be used for things like:

- authorization
- audit logging
- transforming/injecting parameters values
- caching
- ? use your imagination

If we had defined our own custom attribute called LogEverything that logged all requests, we could use it easily by adding it atop an action method:

    [LogEverything]
    public ActionResult Index(){
      return View();      
    }

[action filters](http://bit.ly/XnqSWI)

###View Composition

###Partial Views
Partial views are similar to views, but are intended to be reusable. These can also be "strongly-typed" to a model object and used to render a specific type.  These can be a great way to compose larger views of smaller, more manageable pieces, or can be reused to render similar things across the application.  

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

###Layouts
A layout in ASP.NET MVC is not too different from what is called a Master Page in traditional ASP.NET MVC web forms. Layouts allow you to extract surrounding structure from views into a reusable component.  Typically, the layout will define the html page, script includes, and overall page layout. A view can define a specific layout to use, or when not defined, a default layout can be used.


###Web API
Not specifically part of the MVC namespace, but an API for creating HTTP services, targeted toward building RESTful applications and integrates well within ASP.NET MVC applications:

- similar to MVC, Web API also has a similar route configuration
- handles GET, POST, PUT, DELETE verbs via convention, uses parameter namign for method resolution
- good support for JSON serialization, deserializing objects passed from client

Web API works extremely well within an ASP.NET MVC web application and allows creation of an "API" or service that provides access to model data - create, edit, delete, list, etc.

Using within an MVC application allows a nice separation between requests that serve pages, and requests that should serve resource data or execute commands on the server.

[web api tutorial](http://www.codeproject.com/Articles/344078/ASP-NET-WebAPI-Getting-Started-with-MVC4-and-WebAP)


###Unit Testing
ASP.NET MVC has support for dependency injection and also allows developers to plug in alternative implementations throughout. This design allows us to mock out dependencies and apply a unit testing strategy throughout.  As an example, even controller dependencies can be mocked, allowing us to fully test our code through each layer.

[unit testing in mvc apps](http://msdn.microsoft.com/en-us/magazine/dd942838.aspx#id0420003)

###Single Page Apps (SPAs)
A current trend in web applications is to deliver content initially in a single page, and utilize the client (JavaScript) to handle routing and rendering content, typically using AJAX to communicate with the server.

ASP.NET MVC is still a great choice for apps created with a focus on rendering content client side. Some of the tools available are still a great fit within this model:

- bundling can be used for delivering assets like CSS and JavaScript efficiently
- Web API and its JSON serialization is a great fit for client/server communication


This trend is quickly becoming mainstream, such that Visual Studio now ships with a template for kickstarting the creation of single page web applications. Some of the popular frameworks used include [knockoutjs](http://knockoutjs.com/), [backbonejs](http://backbonejs.org/), [emberjs](http://emberjs.com/), and [angularjs](http://angularjs.org/). After using several of these, we prefer angular.



###Conclusion
There are lots of ASP.NET MVC tutorials on the web, like [this one](http://www.asp.net/mvc/tutorials/mvc-4/getting-started-with-aspnet-mvc4/intro-to-aspnet-mvc-4).  The goal of this is just to familiarize you with a few concepts and help understand the types of things you could be dealing with when building an application using this framework.

A lot of the technologies available throught the MVC framework are focused on server-side coding. While we believe that currently, the best strategy for new applications is to focus on building a great user experience through client side code building responsive single page applications, it is still important for developers to understand the breadth of options available throughout the framework.

Fully understanding the options that the MVC framework provides will allow you to make informed decisions about when, where, and how its technologies could be used (and mixed) within an application. 

For example, a perfectly valid strategy could be to focus on building out the core user experience as an SPA, while utilizing more server side technologies for quickly building out and securing admin pages, pieces that may not need the same love and consistency as the rest of the application initially. 

Utilizing different strategies during stages of an application's evolution could also provide useful. Quickly scaffolding CRUD tasks and generating pages could allow for developers to mock up initial possibilites before deciding on what to build

In the end, it's up to you and your team to decide which pieces of the framework to use - knowing is half the battle.

##Recommended Tools

- [Visual Studio 2012](http://www.microsoft.com/visualstudio/eng/whats-new) - newer tools means better support for web standards, updated tools, debugging experience
- [nuget](http://nuget.org/) - package manager included with visual studio. Easily add libraries to your application
- [ELMAH](http://code.google.com/p/elmah/) - logging for ASP.NET applications
- [smtp4dev](http://smtp4dev.codeplex.com/) - local email server, great to use during development
- [Mindscape Web Workbench](http://www.mindscapehq.com/products/web-workbench) - free version supports SASS, use SASS!
- [ReSharper](http://www.jetbrains.com/resharper/) - nuff said
- a unit testing library - we like [NUnit](http://www.nunit.org/), along with [Moq](http://code.google.com/p/moq/) for mocking dependencies
- [ncrunch](http://www.ncrunch.net/) or [mighty moose](http://continuoustests.com/) - tools that encourage a TDD workflow

- [jenkins](http://jenkins-ci.org/) - continuous integration. automate that!
- [PowerShell](http://technet.microsoft.com/en-ca/scriptcenter/powershell.aspx) - automate that! every developer should learn how to script
