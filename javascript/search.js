const inputElement = document.querySelector("#search-input");
const search_icon = document.querySelector("#search-close-btn");
const sort_wrapper = document.querySelector(".sort-wrapper");

inputElement.addEventListener("input", ()=> {
    handleInputChange(inputElement);
});
search_icon.addEventListener("click", ()=> {
    handleSearchCloseOnClick;
});
sort_wrapper.addEventListener("click", ()=> {
    handleSortIconOnClick;
});

function handleInputChange(inputElement){

    const inputValue = inputElement.inputValue;

    if (inputValue !== ""){
        document.querySelector("search-close-icon").classList.add("search-close-icon-visible");
    }
    else{
        document.querySelector("search-close-icon").classList.remove("search-close-icon-visible");
    }
}

function handleSearchCloseOnClick(){
    document.querySelector("#search-input")
}