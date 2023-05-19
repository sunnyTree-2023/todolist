import { WebApp, Component, EventManager } from './modules/app.js';

// Required to initialize our web app
const app = new WebApp();

// Example of creating a new component with dummy data
// And rendering it to the page
const main = app.component({
    name: "Main",
    selector: "#DemoArea",
    template: "#FooBar",
    data: {
        title: "CPSC431 Final Demo Page",
        buttons: [
            { msg: "Hello", displayText: "Say Hi" },
            { msg: "Goodbye my firend", displayText: "Say Bye" }
        ]
    }
});

main.render("replace");


// Example of adding a regular click event
app.events.click("bar", (e) => {

    const src = e.target;
    const message = src.dataset.message ?? "NO MESSAGE!";
    alert(message);
});

//fetchApiDemo
// Example of rendering a component with an async click event
app.events.click("fetchApiDemo", async (e) => {
    let fakeData = await app.GET("api/test.php");

    let comp = app.component({
        name: "ApiDemoComp",
        selector: "#ApiArea",
        template: "#ApiTemplate", 
        data: fakeData
    });

    comp.render();

    let src = e.target;
    src.dataset.click = "toggleFetch"; 
});

app.events.click("toggleFetch", (e)=>{

    let target = document.querySelector("#fetchButtonTemplate");

    target.classList.toggle("hidden");

});


//Example of using a template that has to be downloaded first
//**Dynamically download the template */
(async () => {

    let dynamicTemplate = await app.GET("templates/demo.html", "text");

    let dynamicData = {
        title: "Dynamic Template and Content $$$$$",
        message: "This is all very dynamic! $$$$$"
    };

    let options = {
        name: "DynamicDemo",
        selector: "#DynamicArea",
        template: dynamicTemplate,
        data: dynamicData
    };

    let comp = app.component(options);

    comp.render();

})(); // Self-Executing function as we can use async/await more easily. 


//NEW FUNCTION 
// app.events.click("jojo",  (e) => {

//     const src = e.target;
//     const message = src.dataset.message ?? "NO MESSAGE!";
//     alert(message);
// });


// list PUT  ======== not work, working on it
//* ****************************************************************************DELETE LIST************************************************************************* */
//* ***************************************************************************************************************************************************** */
//#1 list DELETE data ======== work good  ========   ========    ========   ========   ========   ========   ======== List DELETE data GOOD ======== GOOD DEL
app.events.click("deleteList", async (e) => {


    let src = e.target;

    // get delete button's idx, by dataset
    let idx_js_num = src.dataset.idxhtml;  
                      
    // using async DELETE(url, data, returnType), delete from app.js
    let listData = await app.DELETE(`api/test.php?idx=${idx_js_num}`);  

    if(listData.status == "ok"){
        alert("Deleted Successfully !");
    }

    //refresh the page
    refreshPage();
});

function askingWindow () {
        // Create a new div element
    const div = document.createElement('div');

    // Create a new text node with the desired text content
    const text = document.createTextNode('Hello, world!');

    // Append the text node to the div element
    div.appendChild(text);

    // Append the div element to the body of the HTML document
    document.body.appendChild(div);
}
   
// ** Teacher's code **
//     let src = e.target;
//     let idx = src.dataset.idx; // This is where we get the index!
//     let request = await app.DELETE(`api/list.php?idx=${idx}`);
//     if(request.status == "ok"){
//         alert("Deleted!");
//     }
// });
//* ****************************************************************************************/ DELETE ITEM GOOD
// DELETE item
app.events.click("deleteOneItem", async (e) => {

    let src = e.target;

    // get delete button's idx, by dataset
    let idx_item_num_js = src.dataset.deleteitemidx;  
    //let idx_item_num_js = src.dataset.deleteOneItemIdx; YOU CAN NOT USE CAMEL CASE FOR THE VARIABLE NAME 
   
    // using async DELETE(url, data, returnType), delete from app.js
    let oneItem = await app.DELETE(`api/items.php?delete_one_Item_idx_url=${idx_item_num_js}`);  
    alert("You successfully delete one item !");

    console.log(oneItem);
    if(oneItem.status == "ok"){
        alert(" Successfully cancel one item !");
    }

    //refresh the page
    //refreshPage();
});


// CHECKED item
app.events.click("checkItem", async (e) => {

    //////////////////////////////////////////////
    let listFormData = getFormData("postListForm");
   
    // using  POST(url, data, returnType) from app.js
    // POST method can send listFrom js object to database
    const listData = await app.POST("api/test.php", listFormData);
    console.log(listData); 
    //////////////////////////////////////////////



    let src = e.target;

    // get delete button's idx, by dataset
    let check_idx_item_js = src.dataset.checkitemidx;  
    //let idx_item_num_js = src.dataset.deleteOneItemIdx; YOU CAN NOT USE CAMEL CASE FOR THE VARIABLE NAME 

    //make an JS object to pass value
    const itemTable = {};
    itemTable[check_idx_item_js] = propertyValue;
   
    // using async DELETE(url, data, returnType), delete from app.js
    let itemCheck = await app.PUT(`api/items.php?check_item_idx_url=${check_idx_item_js}`);

    console.log(itemCheck);
    if(itemCheck.status == "ok"){
        alert(" Successfully cancel one item !");
    }

    //refresh the page
    //refreshPage();
});


// Helper function to refresh the page
// And get information from DB again by calling the GET function again 
// refresh/render the page again 
function refreshPage(){
    (async () => {

        // JS object get back from PHP code 
        let dataFromDb = await app.GET("api/test.php");
    
        let comp = app.component({
            name: "GetDataFromDB",  //DB return something  [ {"name":"bob", "created" : "2022-02-02"} , {"name":"bob", "created" : "2022-02-02"}]
            selector: "#get_data",
            template: "#getDataTemplate", 
            data: dataFromDb
        });
        comp.render();
    })();
}


//#1
// Using GET method, get all lists to display on cnosole
(async () => {

    //get data from DB, turn in javascript object
    let data = await app.GET("api/test.php");

    console.log(data);
})();
//* *************************************************************************GET LIST**************************************************************************** */
//* ***************************************************************************************************************************************************** */
//#2 
// list GET data ======== work good  ========   ========    ========   ========   ========   ========   ======== List GET data GOOD ======== GOOD GET
// Click a button with id = "getData"  
// and use GET method, compnents class and render()
// to get all lists to display on webpage
app.events.click("getData", async () => {

    // JS object get back from PHP code 
    let dataFromDb = await app.GET("api/test.php");

    //dataFromDb.parse();

    let comp = app.component({
        name: "GetDataFromDB",  //DB return something  [ {"name":"bob", "created" : "2022-02-02"} , {"name":"bob", "created" : "2022-02-02"}]
        selector: "#get_data",
        template: "#getDataTemplate", 
        data: dataFromDb
    });

    comp.render();
});



//* ***************************************************************************************************/
//************** downlaodList Button Not Work ! **************  downlaodList not work  ***** GET ITEMS
//************** downlaodList Button Not Work ! **************  downlaodList not work  ***** GET ITEMS
// Download list from the list button 
// click the buttons with id = "downlaodList"
// items in the list will be poped up 
app.events.click("downlaodList", async (e) => {

    let src = e.target;
    let idx = src.dataset.idx ?? 0 ;

    if (idx < 1 ) return false;

    //let items = await app.GET(`api/items?list_idx=${idx}`);
    // this function can work is because of test.php file 

    //let items = await app.GET(`api/test.php?idx=${idx}`);   // list_idx is the attribute in the items table 
    let items = await app.GET(`api/items.php?anyListIdxNameHereInUrlForListButton=${idx}`); 

    console.log(items);

    // We got the whole <ul> by "list_idx", idx is different depends on the button click 
    let list = document.querySelector(`#list_${idx}`);
    console.log(list);

    list.classList.remove("hidden");

    // let result = await app.GET(`api/items.php?list_idx=${idx}`);  //itemDatafromDB
    // if (result.status != "ok"){
    //     alert("NOOOOO");
    // }
    items.forEach((item, index)=> {
        // for each items we fetch back from the DB, we using <li> to display it agian and again 
        // display text and adding delete button to each text 
        let listItemTemplate = `
        <li>
        <form id="${index}"> 

            <input type="checkbox" name="checked" data-click="checkItem" data-checkitemidx = "${item.idx}">  
            ${item.text}

            <input type="text" name="text" value = "newItemName + ${item.idx}"  placeholder="text value" >

            <button type="button"  data-click="putItem" data-checkitemidx = "${item.idx}"> changeItemName </button>  
            
            <button type='button' data-deleteitemidx="${item.idx}" data-click='deleteOneItem' >  Delete Item#${index +1} , ${item.idx} </button>
        </li>

        </form> 
        
        `;

        // Appending each item to the button with id = "toggleList",
        // "beforeend" to display the <li>
       // const myDiv = document.getElementById (`#list_${idx}`);
        list.insertAdjacentHTML ("beforeend",  listItemTemplate );
    } );
    // what this for ?  to clean GET error ? 
    // what this attributes for ? 

//     let form = `<form id="postItemForm">
//                 <input type="text" placeholder="List#" name="list_idx_html" maxlength="512">  
//                 <input type="text" placeholder="Item Name" name="name_html" maxlength="11">  

//                 <button type="submit" data-click='postOneItem'  > Submit </button> 
//                 </form>`;

//    // const  myDiv = document.getElementById ("toggleList");
//            list.insertAdjacentHTML ("beforeend",  form );

        src.dataset.click = "toggleList"; 
});

// click the button agian , so the list close 
app.events.click("toggleList", (e)=>{
    let idx = e.target.dataset.idx ?? 0;

    if (idx < 2 ) return false; 

    let selector = `#list_${idx}` ;

    let target = document.querySelector(selector);

    target.classList.toggle("hidden");

});

// {/* <ol>
// <!-- many objects in an array  -->
// {{#.}}
//     <li>
//         <!-- {{name}}, {{created}}, {{idx}} -->
//         <button type="button" data-click="downlaodList" data-idx="{{idx}}" id="toggleList">{{name}}</button>
//         <button type="button" data-click="deleteList" data-idxHtml="{{idx}}" id="deleteButton"> DELETE </button>
//         {{idx}}
//         <!-- what is the purpose for this ul ? Just for create another varaible which name is   list_idx  ?   -->
//         <ul id="list_{{idx}}" class="hidden"> </ul>
//     </li>
// {{/.}}
// </ol>  */}


//* *************************************************************************POST LIST**************************************************************************** */
//* ***************************************************************************************************************************************************** */
// list POST data ======== work good  ========   ========    ========   ========   ========   ========   ======== List POST data GOOD ======== GOOD POST
// list post ======== work good 
app.events.click("postList", async () => {

    // get form id , and return js object 
    let listFormData = getFormData("postListForm");
   
    // using  POST(url, data, returnType) from app.js
    // POST method can send listFrom js object to database
    const listData = await app.POST("api/test.php", listFormData);
    console.log(listData); 
    alert("You Add a New Lisk, After Close the Window. Please Refresh the Page and Click the `** Get List Info from DB **` Button to See Latest Lists ! ");

    // Get a reference to the parent element where you want to add the new p tag
    let modalTextParentElt = document.getElementById("modalText");
    
    // Create a new p element
    const newParagraph = document.createElement('p');

    // Get the input box 
    const inputElement = document.getElementById('input_list');

    // Set the text content of the p tag
    newParagraph.textContent = "You are a list: " + inputElement.value;

    // Append the p tag to the parent element
    modalTextParentElt.appendChild(newParagraph);
});

//************* Wrapping Data from Form into an JSON Object ***************
// Give this the "id" value of any HTML form and it will return
// a native JavaScript object with all the form inputs. 
function getFormData(formId) {
    const form = document.querySelector(`#${formId}`);

    const formData = new FormData(form);

    const entries = Object.fromEntries(formData.entries());

    return entries;
}

//* ********************************************************************************* */
// Item POST ======== working
// There are two ways to grabe form data #1 formData()    #2 JS predefined function  
app.events.click("postOneItem", async (e) => {

    let src = e.target;
    let idx = src.dataset.idx ?? 0 ;

   // if (idx < 1 ) return false;


    alert("item post 1");
    // After user click the "Add Item " button 
    // Get the form element
    const itemFormData =  document.getElementById(`list_${idx}_add`); 
    //list_{{idx}}_add
    

    // Get the value of the id attribute
    //const formId = form.id;

    // get form id , and return js object 

    //let itemFormData = getFormData(formId);
    // let itemFormData = getFormData("postItemForm");
    console.log(itemFormData);
   
    // using  POST(url, data, returnType) from app.js
    // POST method can send listFrom js object to database
    const itemData = await app.POST("api/items.php", itemFormData);
    console.log(itemData); 
    alert("item post");
});

//Tring to add _____________________________________________________________________________________________________
//Modal Windown Associated Code _____________________________________________________________________________________       GOOD   MODEL WINDOW
//**************************************************************************************************************** */
//Add list modal window
app.events.click("addList", async (e) => {

    // JS object get back from PHP code 
    let src = e.target;

    let formId = "AddListForm";

    let comp = app.component({
        name: "AddListComponet",  
        selector: "body",
        template: "#AddListInterface", 
        data: {}
    });

    document.addEventListener(formId, (e)=> {

        let entries = e.detail; 

        closeModal(); 

    }), ({once: true});

    comp.render("add", "beforeend");
});

// close modal window button 
const closeModal = () => {
    document.querySelector(".modal").remove();
    // Get the modal
    // const modal = document.querySelector(".modal");
    // modal.style.display = "none";
   // refreshPage();

};

app.events.click ("closeModal", ()=>{
    //  alert("!");
    closeModal();
});

// submit button 
app.events.click("submit", async (e) => {
    
    e.preventDefault();

    let formId = e.target.idx ?? "noid" ;  // e.target is the from itself

    let formData = new FormData(e.target); // turn from data to nice JS object 

    let entries = Object.fromEntries(formData.entries());

    let submitted = new CustomEvent(formId, {detail: entries}); // detail is optional , we have lisener of this form 

    document.dispatchEvent(submitted);
});

//Tring to add _____________________________________________________________________________________________________
//Modal Windown Associated Code _____________________________________________________________________________________