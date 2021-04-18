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
            let result = await fetch('data.json');
            return result;
        } catch (error) {
            console.log(error);
        }
    }
    
    
}

//class for displaying products or the UI - responsible for grtting all the items returned from class Products and displaying them. 
class UI{

}

//local storage
class Storage{ //classes are in the sugar syntax

}

//setup an event listener - event listener name is DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    //calling a function
    //create instances to classes above

    const ui = new UI(); //instance of the class UI
    const products = new Products();
})





/* === CHANGE COLOR HEADER ===*/
window.onscroll = () => {
    const nav = document.getElementById('header')
    if(this.scrollY >= 200){
        nav.classList.add('scroll-header');
    }else{
        nav.classList.remove('scroll-header')
    }
}



