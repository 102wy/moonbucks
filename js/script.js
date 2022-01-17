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
    const menuForm = document.querySelector("#menu-form");
    const menuInput = document.querySelector("#menu-name");
    const menuList = document.querySelector("#menu-list");
    const menuCount = document.querySelector(".menu-count");
    const submitButton = document.querySelector("#menu-submit-button");
    const navigation = document.querySelector("nav");

    // 어떤상태로 데이터를 관리할것인지 미리 초기화 시켜놓는다.
    this.menu = {
      espresso: [],
      frappuccino: [],
      blended: [],
      teavana: [],
      desert: [],
    };
    this.currentCategory = 'espresso';
    this.init = () => {
      if (store.getLocalStorage()) {
        this.menu = store.getLocalStorage();
      }
      render();
      initEventListeners();
    };

    const render = () => {
      const template = this.menu[this.currentCategory].map((menuItem, index) => {
        return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
        <span class="${menuItem.soldOut ? "sold-out" : ""} w-100 pl-2 menu_name">${menuItem.name}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
          품절
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
        </li>`;
      }).join("");
      
      menuList.innerHTML = template;
      updateMenuCount();
    }

    const updateMenuCount = () => {
      const menuCounting = this.menu[this.currentCategory].length;
      menuCount.innerText = `총 ${menuCounting} 개`
    }
    const addMenuName = () => {
      if (menuInput.value === "") {
        alert ("메뉴를 입력하세요.");
        return;
      }
      const menuName = menuInput.value;
      this.menu[this.currentCategory].push({ name:menuName });
      store.setLocalStorage (this.menu);
      render();
      menuInput.value = "";
    }

    const updateMenuName = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      console.log(menuId);
      const menuName = e.target.closest("li").querySelector(".menu_name");
      const updatedMenuName = prompt("메뉴명을 수정하세요",menuName.innerText);
      this.menu[this.currentCategory][menuId].name = updatedMenuName;
      store.setLocalStorage(this.menu);
      render();
    }
    const removeMenuName = (e) => {
      if(confirm("정말 삭제하시겠습니까?")){
        const menuId = e.target.closest("li").dataset.menuId;
        this.menu[this.currentCategory].splice(menuId, 1);
        store.setLocalStorage(this.menu);
        render();
      }
    };
    
    const soldOutMenu = (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
      store.setLocalStorage(this.menu);
      render();
    };

    const initEventListeners = () => {
      menuList.addEventListener("click" , (e) => {
        if(e.target.classList.contains("menu-edit-button")){
          updateMenuName(e);
          return;
        }
        if(e.target.classList.contains("menu-remove-button")){
          removeMenuName(e);
          return;
        }
        if (e.target.classList.contains("menu-sold-out-button")){
          soldOutMenu(e);
          return;
        }
      });
      menuForm.addEventListener("submit", (e) => {
          e.preventDefault();
      });
      submitButton.addEventListener("click",addMenuName);
      menuInput.addEventListener("keypress", (e) => {
        if (e.key !== "Enter") {
          return;
        }
        addMenuName();
      });
      navigation.addEventListener("click", (e) => {
        const isCategoryButton = e.target.classList.contains("cafe-category-name");
        if(isCategoryButton) {
          const categoryName = e.target.dataset.categoryName;
          const categoryTitle = document.querySelector("#category-title");
          this.currentCategory = categoryName;
          categoryTitle.innerText = `${e.target.innerText} 메뉴 관리`;
          render();
        }
      });
    };    
  }

  const app = new App();
  app.init();
}