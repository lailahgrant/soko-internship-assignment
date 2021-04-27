//select elements and assign them to variable inorder to reuse them
//variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
//to target the buttons of "Add to cart" on the products images ????
        //1st get the buttons & make variables - gets all buttons with class bag-btn
//const btns = document.querySelectorAll(".bag-btn"); - this gives a NodeList, well will be using an array in the class UI
//console.log(btns); //console display is NodeList that is empty  ! why? because selecting the buttons without anything loading.

//create a variable that is at 1st an empty array
//its the main cart -where we'll be placing information, getting information from local storage.
let cart = [];

//once the cart is cleared, button should be set back to initial empty
let buttonsDOM = [];

//setup  classes - where we'll have methods
//class for getting products from the data.json
//create methods in classes
class Products{
//get all the products dynamically
    
    //create methods
    //method to get json with products
    // getProducts() {
    //     //use fetch
    //     fetch("data.json"); //like ajax
    //     //can use async await, - wait till the promise is fulfilled.. - can run code dynamically 
    // }

    //use the above or async await for ajax
    async getProducts() {
        //put our await code in a try block
        try {
            let result = await fetch("data.json"); //use asynchronize way
            //return data using the json method on fetch
            let data = await result.json();    //here we're getting our data in the json format
            
            //return result;  instead of this initial return, we return data

            //return data; destructure this more by doing the following
            let products = data.items; //items is from the json - array
            //use map since it is an array
            products = products.map(item => {
                //for each array item, I destructure it
                const { title, price } = item.fields; //still .fields from data.json
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                //after this iteration , I return a clean object
                return {title, price, id, image}
            })
            //return products;
            return products;


        } catch (error) {
            console.log(error);
        }
    }
    
    
}

//display products
//class for displaying products or the UI - responsible for grtting all the items returned from class Products and displaying them. 
class UI{
    //will have most of the methods
    //everything that will be displayed on the screen will be here
    displayProducts(products) {
        //console
        //console.log(products);

        let result = ''; //empty string for now
        //since an array is being got as an output, I loop throught it
        products.forEach(product => { //this looping will display all the products(as per what is in the json)
            //get properties from the object & place them in the html already have 
            //use += inorder not to override but just add
            //use template literals to access properties that will be on each array to be displayed.
            result += `
            <!-- single product -->
             <article class="product__">
                        <div class="img__container">
                            <img class="product__img" src=${product.image} alt="Plate of salads">
                            <button class="bag-btn" data-id= ${product.id}>
                                <i class="bx bx-shopping-bag"></i>
                                Add to bag
                            </button>
                        </div>
                        <h3>${product.title}</h3>
                        <h4>UGX &nbsp; ${product.price}</h4>
                    </article>
                    <!--End of  Single Product  -->
            `
        });
        //
        //insert the products into the productsDOM(from the variables above)
        productsDOM.innerHTML = result;
    }

    getBagButtons() { 
        //select the buttons - treat them as an array using a Spread operator 
        const buttons = [...document.querySelectorAll(".bag-btn")]; //spread operator & [] turns it in an array
        //console.log(buttons); //returns number of buttons ie. if they are 4 pdts then there are 4 btns

        //assign buttons to buttonsDOM
        buttonsDOM = buttons;

        // for the buttons, used ids to select them
        buttons.forEach(button => {
            //foreach button, get the id
            let id = button.dataset.id;  //get an id of ech button that is on the data-id( dataset )
            //console.log(id);

            //check if an product is in the cart - did this by setting a method in local storage & the moment we load the page, the method will add content to the cart =[] variable
            let inCart = cart.find(item => item.id === id);   //cart empty is empty now //used find method then an arrow fn to compare item id to the pdt id
            //if
            if (inCart) {//if item is in the cart, 
                //make the button incative
                button.disabled = true;
                //change button text to inCart
                button.innerText = "In Cart";
            }// else { - remove the else
            //set a click on the button & an event on the arrow fn
            button.addEventListener('click', (e) => {
                //don't add a button text
                //leave the button active
                //console.log(e);

                //add an item to the cart
                e.target.innerText = "In Cart";
                e.target.disabled = true;

                //a) now get the product from the products in local storage
                //let cartItem =  Storage.getProduct(id);
                //console.log(cartItem); //returns all the information when the button "Add to cart" is clicked on any product
                //destructure using spread operator, send and pass it in the cart=[] variable
                //object
                let cartItem = { ...Storage.getProduct(id), amount: 1 }; //amount:1 property is the one used to control quantity of products in the cart
                //console.log(cartItem); //this returns the product info and also add the amount:1 property


                //b) add product to the cart - add to empty cart=[] array
                cart = [...cart, cartItem]; //add all items you initially have in a cart(empty) and those that are just selected in the above (a)
                //console.log(cart);


                //c) save cart in the local storage
                Storage.saveCart(cart); //saveCart method is in Storage class


                //d) set cart values - when the "Add to cart" is clicked, increase the number of the Bag icon in the header
                this.setCartValues(cart);


                //e) display cart item / add items to the DOM
                //argument as cartItem
                this.addCartItem(cartItem); //we have the item as cartItem got from the Storage.getProduct(id)


                //f) when add to cart is clicked, show the cart in the cart overlay
                this.showCart(); //call method name
                //cart is hidden in css & this method shows it

                    
            });
            //}

        });

        


    }
    //create the setCartValue method after the getBagButtons
    setCartValues(cart) {
        //if I save the item in the cart in any of the storages, map through item
        let tempTotal = 0;
        let itemsTotal = 0;
        //map through items
        cart.map(item => {
            //each item in the cart will have a price and amount, and amount on its own
            //add cart total for each iteration
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        //update cartItems and cartTotal
        //cart total in the overlay
        cartTotal.innerText = parseInt(tempTotal);
        //cartTotal.innerText = parseFloat(tempTotal.toFixed(2));//if you have prices with decimals

        //cart items - bag icon with  a figure in the header
        cartItems.innerText = itemsTotal;

        //console.log(cartTotal, cartItems);
    }

    //parameter as item
    addCartItem(item) { //looking for the item to pass
        //create a div
        const div = document.createElement('div');
        //in product.html, have a cart-item class
        div.classList.add('cart-item');
        //dynamically add these 
        //for the remove, chevron-up & down , add data-id=${item.id}
        //for the anount, add 
        div.innerHTML = `
            <img src=${item.image} alt="Headphone" >
                    

                    <div>
                        <h4>${item.title}</h4>
                        <h5>UGX ${item.price}</h5>
                        <span class="remove-item" data-id=${item.id} >remove</span>
                    </div>
        
                    <div>
                        <i class="bx bx-chevron-up" data-id=${item.id} ></i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="bx bx-chevron-down" data-id=${item.id} ></i>
                    </div>
        `;

         //append the cartContent
        cartContent.appendChild(div); //adds item to the shopping bag 
        //console.log(cartContent);
    }

    //method - no parameters or argumwnts
    showCart() {
        //adding 2 classes to the elements
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
   
    //setup application - method - show, hide cart - acrt overlay, close btn 
    setupAPP() {
        //cart[] - moment the appn loads, the cart array will be assigned values from the storage
        cart = Storage.getCart(); //get this from the local storage
        //upon appn loading,I setup the values that will be in DOM - could be total items or cart total
        this.setCartValues(cart);
        //
        this.populateCart(cart);

        //setup event listener - cart button to show cart, see the cart when cart is loaded for opening the cart and closing the cart
        cartBtn.addEventListener('click', this.showCart);  //call back fn in the addEventLis..()
        closeCartBtn.addEventListener('click', this.hideCart);
    }

    //looking for an argument of array
    populateCart(cart) {
        //use foreach for an array
         //loop through the whole cart
        cart.forEach(item => this.addCartItem(item)); //
    }

    //hidecart - remove the classes that were added in the showCart method
    hideCart() {
        //remove classes on the elements - this is for the cart X close button
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
    }

    //setup cart Logic - call it from the document.add....
    //setup clear cart button, event for removing a cart, reducing or increasing the amount of pdt in the cart
    cartLogic() {
        //clear cart btn
        clearCartBtn.addEventListener("click", () => {
            this.clearCart(); //now this points to the UI class and not just the button like the commented code below
            //this helps us access anything in the class
        });
        // clearCartBtn.addEventListener('click', this.clearCart); //in the call back fn, call a method referencing a btn

        /*cart functionality
        ________________________*/

        //used event bubbling for the remove btn, increase and decrease icons in the cart-content
        //event bubble on cartContent
        //add an event listener looking for click events,run a call back fn, as a call back fn - get an event as an argument for accessing remove btn, increase and decrease icon
        cartContent.addEventListener('click', event => {
            //console.log(event.target); //returns the items html and classes clicked on like remove btn, increase and decrease icon
            if (event.target.classList.contains('remove-item')) //use classes on those items to target them
            {
                let removeItem = event.target;
                //console.log(removeItem); //returns remove btn html

                //get id to use to remove iitem
                let id = removeItem.dataset.id;

                 //remove item from the DOM - item is removed from the bag number count, on refresh - item is nolonger in the cart content
                //console.log(removeItem.parentElement.parentElement);
                cartContent.removeChild(removeItem.parentElement.parentElement);

                // call a method of removeItem - it removes item from the cart overlay only
                this.removeItem(id);

            } else if (event.target.classList.contains('bx-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                //console.log(addAmount); //returns html of the chevron up
                
            }
        });


    }

    //clearCart in the call back fn of event handler above
    clearCart() {
        //console.log(this);
        //to clear the cart, would like to 1st select all the items' ids in the cart
        let cartItems = cart.map(item => item.id); //getting all items
        //console.log(cartItems);
        //loop through the array with cartItems, call another method(haven't created it yet but will create it next) which will have removing of these items  in the cart
        cartItems.forEach(id => this.removeItem(id));

        //console.log(cartContent.children); //returns the divs of the items when "clear cart" button is pressed

        //to completely remove items from the cart overlay / cart-content
        //there's a div with cart-content class
        //use while, DOM documents have the children component
        while (cartContent.children.length > 0) {
            //remove content when children are greater than 0
            cartContent.removeChild(cartContent.children[0]);
        }
        //the moment the cart is cleared, hide the cart
        this.hideCart(); //call this method


    }

    removeItem(id) {
        //to remove item in car, have to filter the items in the cart
        cart = cart.filter(item => item.id !== id);//return only when the cartItem isn't = to the id
        //set the cart total values to 0 once the cart is cleared
        this.setCartValues(cart);
        //get the latest info of cart emptiness when cart cleared
        Storage.saveCart(cart);
        
        //access the buttons of Add to cart from the incart
        //set another method - for reusing (getSingleButton(id))
        let button = this.getSingleButton(id);

        //if the getSingleButton(id) method is created, the button is assigned as above botton variable - now I disable the button
        //the specific button
        button.disabled = false;

        //change the innerHTML 
        button.innerHTML = `<i class="bx bx-shopping-bag"></i>
                                Add to bag`;

    }

    getSingleButton(id) { //pass the id got from the removeItem(id) method
        return buttonsDOM.find(button => button.dataset.id === id);  //this will get the specific button that was used to add an item to the cart
    }
    

}

//local storage
class Storage{ //classes are in the sugar syntax
    
//create a static method & this can be used without instantiating its class (creating an instance from the class)
    static saveProducts(products) {
        //can access local storage
        //setItem() method, pass a set of "key :pair" value & need to stringfy it bse need to save it as a string and then as an array
        //local storage to help view products in cart even when one refreshes
        localStorage.setItem("products", JSON.stringify(products));
    }

    //static method of getProduct
    static getProduct(id) { //id is from buttons

        //parse it from string   - then get it... 
        //in saveproducts it is set & now here its get.
        //this returns the array in the local storage
        let products = JSON.parse(localStorage.getItem('products'));
        //set it up using:-
        return products.find(product => product.id === id);


    }

    //
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart)); //check application, local storage in the inspect, click on the "add to cart" btn 
    }

    //setupp Application will be assigned values from the storage
    static getCart() {
        //return a value using an itenary operator / if else
        //1st check if the item in the local storage exists or not
        //if this is true, 1st statement after ? is executed &
        //if it's not true, an empty array is returned.
        return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem("cart")) : [];
    }

}

//setup an event listener - event listener name is DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    //calling a function
    //create instances to classes above

    const ui = new UI(); //instance of the class UI
    const products = new Products();

    //setup Application
    ui.setupAPP();  //

    //get all products
    //products.getProducts().then(data => console.log(data));
    //use the products from the getProducts()
    // products.getProducts().then(products => { console.log(products) });
    
    //need to display content on the screen (ui) & not console - then we use ui.displayProducts(call the function in the class UI)
    products.getProducts().then(products => {
        ui.displayProducts(products);

        //storage - for cases of viewing only one item in places like the product "in cart" - go to inspect on browser, Application, local storage
        //Storage class has a static method hence no instance created, jusr use the class as follows
        Storage.saveProducts(products);

        //keep cart information in local storage so that even on refresh, products in the cart aren't lost

        //to target the buttons of "Add to cart" on the products images ????
        //1st get the buttons & make variables
        //can chain up the .then inorder to show content on these buttons
        
    }).then(() => {//these buttons load after displayproducts and saveproducts are loaded.
        //pass an arrow fn & in it pass 2 
        ui.getBagButtons(); //call the method from class
        ui.cartLogic(); //setup another method in the UI class to cater for remove,add or reduce amount of products in the cart -cart overlay
    }); 
    
});






/* === CHANGE COLOR HEADER ===*/
window.onscroll = () => {
    const nav = document.getElementById('header')
    if(this.scrollY >= 200){
        nav.classList.add('scroll-header');
    }else{
        nav.classList.remove('scroll-header')
    }
}



