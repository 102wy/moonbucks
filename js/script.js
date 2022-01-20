window.onload = function () {
  const store = {
    setLocalStorage(menu) {
      localStorage.setItem("menu", JSON.stringify(menu));
    },
    getLocalStorage() {
      return JSON.parse(localStorage.getItem("menu"));
    },
  };

  const BASE_URL = "http://localhost:3000/api";
  const HTTP_METHOD = {
    POST(data) {
      return {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
        },
        body: data ? JSON.stringify(data) : null, //삼항연산자
      };
    },
    PUT(data) {
      return {
        method: "PUT",
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(data),
      }
    },
    DELETE() {
      return {
        method: "DELETE",
      }
    }
  }
  const request = async (url, option) => {
    const response = await fetch(url, option);
    if (!response.ok) {
      alert("에러가 발생했습니다.");
      console.error(e);
    }
    return response.json();
  };

  const requestWithoutJson = async (url, option) => {
      const response = await fetch(url, option);
      if (!response.ok) {
        alert("에러가 발생했습니다.");
        console.error(e);
      }
      return response;
  }
  const MenuApi = {
    getAllMenuByCategory(category) {
      return request(`${BASE_URL}/category/${category}/menu`);
    },
    createMenu(category, name) {
      return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name }));
    },
    updateMenu(category, name, menuId){
      return request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
    },
    toggleSoldOutMenu(category , menuId){
      return request (`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
    },
    deleteMenu(category, menuId){
      return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
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
    this.init = async() => {
      render();
      initEventListeners();
    };

    const render = async () => {
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
      const template = this.menu[this.currentCategory].map((menuItem) => {
        return `
        <li data-menu-id="${menuItem.id}" class="menu-list-item d-flex items-center py-2">
        <span class="${menuItem.isSoldOut ? "sold-out" : ""} w-100 pl-2 menu-name">${menuItem.name}</span>
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
    const addMenuName = async () => {
      if (menuInput.value === "") {
        alert ("메뉴를 입력하세요.");
        return;
      }
      
      const duplicatedItem = this.menu[this.currentCategory].find(menuItem => menuItem.name === menuInput.value);
      if (duplicatedItem) {
        alert("이미 등록된 메뉴입니다.");
        menuInput.value = "";
        return;
      }
      const menuName = menuInput.value;
      await MenuApi.createMenu(this.currentCategory, menuName);
        render();
        menuInput.value = "";
    };

    const updateMenuName = async (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      const menuName = e.target.closest("li").querySelector(".menu-name");
      const updatedMenuName = prompt("메뉴명을 수정하세요",menuName.innerText);
      await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
      render();
    }
    const removeMenuName = async (e) => {
      if(confirm("정말 삭제하시겠습니까?")){
        const menuId = e.target.closest("li").dataset.menuId;
        await MenuApi.deleteMenu(this.currentCategory, menuId);
        render();
      }
    };
    
    const soldOutMenu = async (e) => {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
      render();
    };

    const changeCategory = (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
        if(isCategoryButton) {
          const categoryName = e.target.dataset.categoryName;
          const categoryTitle = document.querySelector("#category-title");
          this.currentCategory = categoryName;
          categoryTitle.innerText = `${e.target.innerText} 메뉴 관리`;
          render();
      }
    }

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
      navigation.addEventListener("click", changeCategory);
    };    
  }

  const app = new App();
  app.init();
}