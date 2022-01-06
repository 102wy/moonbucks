window.onload = function () {


    const espressoMenuName = document.querySelector("#espresso_menu_name");
    const espressoMenuForm = document.querySelector("#espresso_menu_form");
    const espressoMenuList = document.querySelector("#espresso_menu_list");
    const espressoMenuButton = document.querySelector("#espresso_menu_submit_button");
    const menuCount = document.querySelector(".menu_count");

    // 메뉴추가

    espressoMenuForm.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    espressoMenuName.addEventListener("keypress", menuKeypress);

    function menuKeypress(e) {

        if (e.key !== "Enter") {
            return;
        }
        espressoAddMenuName();
    }

    espressoMenuButton.addEventListener("click", () => {
        espressoAddMenuName();
    });

    function espressoAddMenuName() {
        if (espressoMenuName.value === "") {
            alert("값을 입력해주세요");
            return;
        } else {
            const espressoMenuNameValue = espressoMenuName.value;
            const menuItemTemplate = (espressoMenuNameValue) => {
                return `
            <li class="menu_list_item d-flex items-center py-2">
            <span class="w-100 pl-2 menu_name">${espressoMenuNameValue}</span>
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
            espressoMenuList.insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuNameValue));


            // 메뉴 갯수 count
            menuCountUpdate();
            espressoMenuName.value = "";
        }
    }

    // 메뉴수정,삭제
    espressoMenuList.addEventListener("click", buttonEvent);

    function buttonEvent(e) {
        const menuNameTarget = e.target.closest("li").querySelector(".menu_name")
        const menuName = menuNameTarget.innerText;

        if (e.target.classList.contains("menu_edit_button")) {
            const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);

            menuNameTarget.innerText = updatedMenuName;
        }

        if (e.target.classList.contains("menu_remove_button")) {
            if (confirm("정말로 삭제 하시겠습니까?")) {
                e.target.closest("li").remove();
                menuCountUpdate();
            }
        }
    }

    function menuCountUpdate() {
        const menuCountLi = document.querySelectorAll(".menu_list_item").length;
        menuCount.innerText = `총 ${menuCountLi} 개`;
    }

}