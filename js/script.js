window.onload = function () {
    
    function App (){
        const espressoMenuForm = document.querySelector("#espresso_menu_form");
        const espressoMenuInput = document.querySelector("#espresso_menu_name");
        const espressoMenuList = document.querySelector("#espresso_menu_list");
        const menuCount = document.querySelector(".menu_count");
        const submitButton = document.querySelector("#espresso_menu_submit_button");
        const updateMenuCount = () => {
          const menuCounting = espressoMenuList.querySelectorAll("li").length;
          menuCount.innerText = `총 ${menuCounting} 개`
        }
        const updateMenuName = (e) => {
          const menuName = e.target.closest("li").querySelector(".menu_name");
          const updatedMenuName = prompt("메뉴명을 수정하세요",menuName.innerText);
          menuName.innerText = updatedMenuName;
        }
        const removeMenuName = (e) => {
          if(confirm("정말 삭제하시겠습니까?")){
            e.target.closest("li").remove();
            updateMenuCount();
          }
        }
        const addMenuName = () => {
          if (espressoMenuInput.value === "") {
            alert ("메뉴를 입력하세요.");
            return;
          }
          const espressoMenuName = espressoMenuInput.value;
          const menuItemTemplate = (espressoMenuName) => {
          return `
          <li class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu_name">${espressoMenuName}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu_edit_button"
          >
            수정
          </button>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm menu_remove_button"
          >
            삭제
          </button>
          </li>`;
          };
          espressoMenuList.insertAdjacentHTML("beforeend",menuItemTemplate(espressoMenuName));
          updateMenuCount();
          espressoMenuInput.value = "";
        }
        
        espressoMenuList.addEventListener("click" , (e) => {
          if(e.target.classList.contains("menu_edit_button")){
            updateMenuName(e);
          }

          if(e.target.classList.contains("menu_remove_button")){
            removeMenuName(e);
          }
        });

        espressoMenuForm.addEventListener("submit", (e) => {
            e.preventDefault();
        });

        submitButton.addEventListener("click",addMenuName);
        espressoMenuInput.addEventListener("keypress", (e) => {
          if (e.key !== "Enter") {
            return;
          }
          addMenuName();
        });
    }

    App();
}