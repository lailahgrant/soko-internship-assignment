


















/* === CHANGE COLOR HEADER ===*/
window.onscroll = () => {
    const nav = document.getElementById('header')
    if(this.scrollY >= 200){
        nav.classList.add('scroll-header');
    }else{
        nav.classList.remove('scroll-header')
    }
}



