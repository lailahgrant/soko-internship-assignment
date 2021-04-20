//select elements and assign them to variable inorder to reuse them
//variables

const cartBtn = document.querySelector('.bag-btn');
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
        cartContent.appendChild(div);
        //console.log(cartContent);
    }

    showCart() {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
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

}

//setup an event listener - event listener name is DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    //calling a function
    //create instances to classes above

    const ui = new UI(); //instance of the class UI
    const products = new Products();

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



