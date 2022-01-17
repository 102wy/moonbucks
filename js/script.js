window.onload = function () {
  const store = {
    setLocalStorage(menu) {
      localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
      return JSON.parse(localStorage.getItem("menu"));
    },
  };

  function App (){
    const espressoMenuForm = document.querySelector("#espresso_menu_form");
    const espressoMenuInput = document.querySelector("#espresso_menu_name");
    const espressoMenuList = document.querySelector("#espresso_menu_list");
    const menuCount = document.querySelector(".menu_count");
    const submitButton = document.querySelector("#espresso_menu_submit_button");

    // 어떤상태로 데이터를 관리할것인지 미리 초기화 시켜놓는다.
    this.menu = [];
    this.init = () => {
      if (store.getLocalStorage().length > 1) {
        this.menu = store.getLocalStorage();
        render();
      }
    };

    const render = () => {
      const template = this.menu.map((menuItem, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu_name">${menuItem.name}</span>
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
      }).join("");
      
      espressoMenuList.innerHTML = template;
      updateMenuCount();
    }

    const updateMenuCount = () => {
      const menuCounting = espressoMenuList.querySelectorAll("li").length;
      menuCount.innerText = `총 ${menuCounting} 개`
    }
    const addMenuName = () => {
      if (espressoMenuInput.value === "") {
        alert ("메뉴를 입력하세요.");
        return;
      }
      const espressoMenuName = espressoMenuInput.value;
      this.menu.push({ name:espressoMenuName });
      store.setLocalStorage (this.menu);
      render();
      espressoMenuInput.value = "";
    }

    const updateMenuName = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      console.log(menuId);
      const menuName = e.target.closest("li").querySelector(".menu_name");
      const updatedMenuName = prompt("메뉴명을 수정하세요",menuName.innerText);
      this.menu[menuId].name = updatedMenuName;
      store.setLocalStorage(this.menu);
      menuName.innerText = updatedMenuName;
    }
    const removeMenuName = (e) => {
      if(confirm("정말 삭제하시겠습니까?")){
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu.splice(menuId, 1);
        store.setLocalStorage(this.menu);
        e.target.closest("li").remove();
        updateMenuCount();
      }
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

  const app = new App();
  app.init();
}