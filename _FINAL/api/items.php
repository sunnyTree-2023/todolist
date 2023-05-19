<?php
// Uncomment if you need to have detailed error reporting
 error_reporting(E_ALL);

// Include the Handler class so we can use it. 
require("helpers/handler.php");

// Create a new request handler. 
$handler = new Handler();

// Process the request
$handler->process();

// Handler Functions

// api/items.php?idx=2  would execute this function
// function GET(Handler $handler)
// {
//     // Use the $id and output just 1 thing
//    // $params = ["idx" = > 2 ];

//     $pdo = $handler->db->PDO();

//     // $query = "SELECT * FROM `items` WHERE list_idx=(?)";

//     $query = "CALL get_items(2)";

//     $statement = $pdo->prepare($query);

//     $statement->execute();  // ans: array :[$id,$name,$address]

//     $result = $statement->fetchAll();

//     $handler->response->json($result);
// }


// process /api/test on a GET request
// function GET(Handler $handler)
// {
//     // It is common to have multiple types of get requests depending on
//     // if you want 1 or multiple records or need to filter, etc. 
//     // You can write alternate functions and use this one to decide which one to execute
//     if (array_key_exists("idx", $handler->request->get)) {
//         getSingle($handler, $handler->request->get["idx"]);
//     } else {
//         getItems($handler);
//     }
// }

function GET (Handler $h)  // GOOD //
{
    $data=[];
    $idx = $h->request->get["delete_one_Item_idx"] ?? false;
    $list_idx = $h->request->get["anyListIdxNameHereInUrlForListButton"] ?? false;  // get anyListIdxNameHere value in URL, URL // JS get request give it to you
                                                                  // let items = await app.GET(`api/items.php?anyListIdxNameHere=${idx}`); 
    if ($idx !== false)
    {
        $h->response->json(getOneItem($h, $idx));
    }

    if ($list_idx !== false)
    {
        $h->response->json(getManyItems($h, $list_idx));
    }

    // if no any parameter inputted, output error code
    $h->response->httpResponseCode("400", "Server Error - Bad Input");
}

function getOneItem (Handler $handler, $idx)
{
    // Use the $id and output just 1 thing
    $pdo = $handler->db->PDO();

   // $idx = $handler->request->get["idx"];  // ******** get["idx"]; from from end button id *******

    // $query = "SELECT * FROM `items` WHERE list_idx=(?)";
    $query = "CALL get_one_item(?)";

    $statement = $pdo->prepare($query);

    $statement->execute([$idx]);  // ans: array :[$id,$name,$address]

    $result = $statement->fetchAll();

    $handler->response->json($result);
}


function getManyItems (Handler $handler, $list_idx)
{
    // Use the $id and output just 1 thing

    //$list_idx = $handler->request->get["idx"]; // yes, you are right, but we do not get "idx" here. 

    $pdo = $handler->db->PDO();

    // $query = "SELECT * FROM `items` WHERE list_idx=(?)";
    $query = "CALL get_list_items(?)";  // GOOD //

    $statement = $pdo->prepare($query);

    $statement->execute([$list_idx]);  // ans: array :[$id,$name,$address]

    $result = $statement->fetchAll();

    $handler->response->json($result);
}

function DELETE(Handler $handler)
{
    $pdo = $handler->db->PDO();

    //get the idx of the itme that we want to delete 
    //Gobal varibale mean any function and any scope can get the varible  ? 
    $item_idx = $handler->request->get["delete_one_Item_idx_url"]; // THE BACK END GET DATA FROM "URL" "URL" "URL" !!! FROM JAVASCRIPT JAVASCRIPT FETCH() FETCH()
    //var_dump($item_idx);

    // Ans: Prepare the delete statement with a placeholder for the id 
    //$query = "DELETE FROM `items` WHERE idx=(?)";
    $query = "CALL delete_item(?)";

    $stmt = $pdo->prepare($query);

    // Ans: Execute the statement
    $stmt->execute([$item_idx]);

    $result = [ "status" => "you delete a item" ];
    // $result = [ "status" => "delete successfully" ];

    $handler->response->json($result);

}






// // api/test.php?id=123 would execute this function
// function getSingle(Handler $handler, $id)
// {
//     // Use the $id and output just 1 thing

//     $pdo = $handler->db->PDO();

//     // $query = "SELECT * FROM `items` WHERE list_idx=(?)";

//     $query = "CALL get_items(?)";

//     $statement = $pdo->prepare($query);

//     $statement->execute([$id]);  // ans: array :[$id,$name,$address]

//     $result = $statement->fetchAll();

//     $handler->response->json($result);
// }

// // api/test.php would execute this function
// function getItems(Handler $handler)
// {
//     $pdo = $handler->db->PDO();

//     $query = "SELECT * FROM items";  //mySQL function  where this statement used ? 

//     $statement = $pdo->prepare($query);

//     $statement->execute();    // What is the different between this with line 40 execute() ?

//     $results = $statement->fetchAll();

//     // ** Different between them ??? **
    
//     $handler->response->json($results);  // JSON string

// }


// process api/test.php on a POST request
function POST(Handler $handler) // GOOD//
{
   // Mine
    $pdo = $handler->db->PDO();

    $parameter = [
        // ":list_idx" => $handler->request->input["list_idx_html"],
        // ":name" => $handler->request->input["name_html"]
        ":list_idx" => $handler->request->input["list_idx_html"],
        ":text" => $handler->request->input["text_html"]
    ];
    
    
    //js object, name => userinput
    //request to get =>  users submit to the form

    $query = 'CALL insert_new_item(:list_idx,:text)';  //mySQL function  where this statement used ? 

    $statement = $pdo->prepare($query);

    //execute() should have the list name parameter 
    $statement->execute($parameter);    // What is the different between this with line 40 execute() ?

    $results = $statement->fetchAll();

    // ** Different between them ??? **
    
    $handler->response->json($results);  // JSON string
//



// $parameter = [":name" => $handler->request->input["name"]]; //js object, name => userinput
// //request to get =>  users submit to the form


// //INSERT INTO `list` (name) VALUES (input_listname);
// $query = 'CALL insert_list(:name);';  //mySQL function  where this statement used ? 

// $statement = $pdo->prepare($query);

// //execute() should have the list name parameter 
// $statement->execute($parameter);    // What is the different between this with line 40 execute() ?

// $results = $statement->fetchAll();

// // ** Different between them ??? **

// $handler->response->json($results);  // JSON string
}



// process api/test.php on a PUT request
function PUT(Handler $handler, $item_check_idx)  
{
    // You could include an id in the URL as a get variable
    // But more likely it's already in the input data being sent via request->input. 
    // Connect to the DB and execute the necessary query to update the record (row). 

       // Mine
       $pdo = $handler->db->PDO();

       $parameter = [
           ":item_check_idx" => $handler->request->input["item_check_idx"],
           //":checked_status" => $handler->request->input["checked_status"],
       ];
       
       
       //js object, name => userinput
       //request to get =>  users submit to the form
   
       $query = 'CALL change_item_status(:item_check_idx, :checked_status)';  //mySQL function  where this statement used ? 
   
       $statement = $pdo->prepare($query);
   
       //execute() should have the list name parameter 
       $statement->execute($parameter);    // What is the different between this with line 40 execute() ?
   
       $results = $statement->fetchAll();
   
       // ** Different between them ??? **
       
       $handler->response->json($results);  // JSON string
}


// process api/test.php on a DELETE request
// fetching to "api/test.php?id=123" with "DELETE" as the method
// will execute this function
// function DELETE(Handler $handler)
// {
//     // It's common to send a specific id so we know 
//     // which resource to delete
//     // The method here is "DELETE" but we still have access to 
//     // get variables since they are part of the URL. 
   

//     // Here you would connect to the DB and use $id as a parameter
//     // To delete the resource (row) with a matching id. 
//     // Ans: Connecting to DB in php
//     $pdo = $handler->db->PDO();

//     $id = $handler->request->get["id"];

//     // Ans: Prepare the delete statement with a placeholder for the id 
//     $query = "DELETE FROM `person` WHERE idx=(?)";

//     $stmt = $pdo->prepare($query);

//     // Ans: Execute the statement
//     $statement->execute([$id]);

// }
