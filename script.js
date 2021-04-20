//select elements and assign them to variable inorder to reuse them
//variables

const cartBtn = document.querySelector('.bag-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector("cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");

//create a variable that is at 1st an empty array
//its the main cart -where we'll be placing informstion, getting information from local storage.
let cart = [];

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
                        <h4>${product.price}</h4>
                    </article>
                    <!--End of  Single Product  -->
            `
        });
        //
        //insert the products into the productsDOM(from the variables above)
        productsDOM.innerHTML = result;
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



