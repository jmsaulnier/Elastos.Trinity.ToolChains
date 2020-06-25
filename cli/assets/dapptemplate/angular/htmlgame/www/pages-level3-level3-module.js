(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["pages-level3-level3-module"],{

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/level3/level3.page.html":
/*!*************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/pages/level3/level3.page.html ***!
  \*************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-content>\n  <ion-grid>\n\n    <!-- Show loading screen -->\n    <div align=\"center\" *ngIf=\"!startGame\">\n      <br>\n      <h2>Match All Coins!</h2>\n      <p>You have a total of <b>{{ userLife }}</b> tries.</p>\n      <br>\n      <h4>Start in <span style=\"color:#CC0000;font-size:24px;\">{{ countDown }}</span>...</h4>\n    </div>\n\n    <!-- Actual cards display -->\n    <div align=\"center\" *ngIf=\"startGame && gameState === 'init'\">\n      <h2>Match All Coins!</h2>\n      <ion-row class=\"ion-align-items-center ion-text-center\" size=\"8\">\n\n        <ion-col class=\"ion-align-self-center\" size=\"3\" *ngFor=\"let c of cardsArray; let i = index\">\n          <!-- show card background -->\n          <img src=\"../../assets/game/cards/background.jpg\" *ngIf=\"c.pos != selectCard1pos && c.pos != selectCard2pos && c.val > -1\" (click)=\"selectCard(c.pos, c.val, i)\">\n          <!-- show card 1 selected -->\n          <img [src]=\"imageDir + gameService.images[c.val] + '.png'\" *ngIf=\"c.pos == selectCard1pos && c.val > -1\">\n          <!-- show card 2 selected -->\n          <img [src]=\"imageDir + gameService.images[c.val] + '.png'\" *ngIf=\"c.pos == selectCard2pos && c.val > -1\">\n          <!-- show hidden card -->\n          <img *ngIf=\"c.val == -1\" style=\"visibility: hidden;\">\n\n        </ion-col>\n      </ion-row>\n    </div>\n\n    <div align=\"center\" *ngIf=\"startGame && gameState === 'init'\">\n      <ion-row>\n        <ion-col col-9 class=\"ion-no-padding\">\n          <p class=\"ion-no-margin\">You have <span style=\"color:#00CC00; font-size: 24px;\">{{ userLife }}</span> tries...</p>\n        </ion-col>\n        <ion-col class=\"ion-no-padding\">\n          <p class=\"ion-o-margin\"><span style=\"color:#CC0000; font-size: 24px;\">{{ shownTime }}</span></p>\n        </ion-col>\n      </ion-row>\n    </div>\n\n    <!-- Show Win screen -->\n    <div *ngIf=\"gameState === 'win'\" align=\"center\">\n      <br>\n      <h2>You <span style=\"color:#00CC00; font-size: 28px;\">WON</span>!</h2>\n      <p>There's 1 more level ahead, can you HODL on?</p>\n      <br>\n      <ion-button mode=\"ios\" size=\"large\" color=\"success\" (click)=\"nextLevel()\">\n        <ion-icon name=\"repeat\"></ion-icon>\n        &nbsp; &nbsp; Level 4\n      </ion-button>\n    </div>\n\n    <!-- Show Lose screen -->\n    <div *ngIf=\"gameState === 'lose'\" align=\"center\">\n      <br>\n      <h2>You <span style=\"color:#CC0000; font-size: 28px;\">LOST</span>!</h2>\n      <p>Would you like to try again?</p>\n      <br>\n      <ion-button mode=\"ios\" size=\"large\" color=\"danger\" routerLink=\"/level1\" routerDirection=\"back\">\n        <ion-icon name=\"repeat\"></ion-icon>\n        &nbsp; &nbsp; Reset Game\n      </ion-button>\n    </div>\n\n  </ion-grid>\n\n  <ion-fab vertical=\"bottom\" horizontal=\"end\" slot=\"fixed\" class=\"ion-padding-bottom ion-padding-end\">\n    <ion-fab-button routerLink=\"/level1\">\n      <ion-icon name=\"refresh\"></ion-icon>\n    </ion-fab-button>\n  </ion-fab>\n\n</ion-content>\n");

/***/ }),

/***/ "./src/app/pages/level3/level3.module.ts":
/*!***********************************************!*\
  !*** ./src/app/pages/level3/level3.module.ts ***!
  \***********************************************/
/*! exports provided: Level3PageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Level3PageModule", function() { return Level3PageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _level3_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./level3.page */ "./src/app/pages/level3/level3.page.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};






var routes = [
    {
        path: '',
        component: _level3_page__WEBPACK_IMPORTED_MODULE_5__["Level3Page"]
    }
];
var Level3PageModule = /** @class */ (function () {
    function Level3PageModule() {
    }
    Level3PageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ],
            declarations: [_level3_page__WEBPACK_IMPORTED_MODULE_5__["Level3Page"]]
        })
    ], Level3PageModule);
    return Level3PageModule;
}());



/***/ }),

/***/ "./src/app/pages/level3/level3.page.scss":
/*!***********************************************!*\
  !*** ./src/app/pages/level3/level3.page.scss ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("h2 {\n  font-weight: 800; }\n\nimg {\n  width: 80px;\n  height: 80px;\n  border: solid 2px #000;\n  border-radius: 12px; }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jaGFkcmFjZWxpcy9Db2RpbmcvVHJpbml0eS9Ccm93c2VyL1Rvb2xjaGFpbnMvRWxhc3Rvcy5UcmluaXR5LlRvb2xDaGFpbnMvY2xpL2Fzc2V0cy9kYXBwdGVtcGxhdGUvYW5ndWxhci9odG1sZ2FtZS9zcmMvYXBwL3BhZ2VzL2xldmVsMy9sZXZlbDMucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZ0JBQWdCLEVBQUE7O0FBR2xCO0VBQ0UsV0FBVTtFQUNWLFlBQVc7RUFDWCxzQkFBc0I7RUFDdEIsbUJBQW1CLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9wYWdlcy9sZXZlbDMvbGV2ZWwzLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImgyIHtcbiAgZm9udC13ZWlnaHQ6IDgwMDtcbn1cblxuaW1nIHtcbiAgd2lkdGg6ODBweDtcbiAgaGVpZ2h0OjgwcHg7XG4gIGJvcmRlcjogc29saWQgMnB4ICMwMDA7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/pages/level3/level3.page.ts":
/*!*********************************************!*\
  !*** ./src/app/pages/level3/level3.page.ts ***!
  \*********************************************/
/*! exports provided: Level3Page */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Level3Page", function() { return Level3Page; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var src_app_services_game_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/services/game.service */ "./src/app/services/game.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (undefined && undefined.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};



var Level3Page = /** @class */ (function () {
    function Level3Page(gameService, router) {
        this.gameService = gameService;
        this.router = router;
        this.cardsTotal = 16; // Total cards to match (divided by 2)
        this.cardsArray = []; // Store all card pairs
        this.userLife = 6; // Total amount of tries user gets
        this.imageDir = '../../assets/game/coins/';
        this.selectCard1pos = -1; // Selected card #1 position
        this.selectCard1val = -1; // Selected card #1 value
        this.selectCard2pos = -1; // Selected card #2 position
        this.selectCard2val = -1; // Selected card #2 value
        this.selectOldPosix = -1; // Store old position
        this.debugText = "Debug text goes here! :)";
    }
    Level3Page.prototype.ngOnInit = function () {
        this.restartGame();
    };
    Level3Page.prototype.ionViewWillEnter = function () {
        titleBarManager.setTitle('Level 3');
    };
    // Function to populate cards array with
    // position and value pairs from 0 to 6
    Level3Page.prototype.populateCards = function () {
        this.cardsArray = [];
        var x = 0;
        var y = 0;
        for (var i = 0; i < this.cardsTotal; i++) {
            // Push card to array and assign value
            this.cardsArray.push({ pos: i, val: y });
            // Flip x to assign next card same value
            if (x === 0)
                x = 1;
            else {
                x = 0;
                y++;
            }
        }
    };
    // Function to select a card
    Level3Page.prototype.selectCard = function (pos, val, i) {
        var _this = this;
        var actOne = false;
        // Code to select the second card
        if (this.selectCard1pos > -1 && this.selectCard2pos == -1) {
            this.selectCard2pos = pos;
            this.selectCard2val = val;
            actOne = true;
        }
        // Code to select the first card
        if (this.selectCard1pos == -1 && !actOne) {
            this.selectCard1pos = pos;
            this.selectCard1val = val;
            this.selectOldPosix = i;
        }
        // If we have both cards selected, check for match or fail
        if (actOne && this.selectCard1pos > -1 && this.selectCard2pos > -1) {
            setTimeout(function () {
                // if the cards match, do this...
                if (_this.selectCard1val === _this.selectCard2val) {
                    _this.debugText = "Cards match!";
                    _this.cardsArray.splice(_this.selectOldPosix, 1, { pos: _this.selectOldPosix, val: -1 });
                    _this.cardsArray.splice(i, 1, { pos: i, val: -1 });
                    _this.resetSelects();
                    _this.winCon();
                }
                // Otherwise, take a life and reset
                else {
                    _this.debugText = "Cards don't match!";
                    _this.userLife -= 1;
                    _this.resetSelects();
                    if (_this.userLife <= 0)
                        _this.loseCon();
                }
            }, 1000);
        }
    };
    // Function to shuffle an array
    Level3Page.prototype.shuffle = function (a) {
        var j, x, i;
        for (i = a.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = a[i - 1];
            a[i - 1] = a[j];
            a[j] = x;
        }
    };
    Level3Page.prototype.nextLevel = function () {
        this.restartGame();
        this.router.navigate(['level4']);
    };
    // Function to restart the game
    Level3Page.prototype.restartGame = function () {
        var _this = this;
        this.gameState = 'load'; // Keep track of current game state
        this.startGame = false; // Will set to false to display intro
        this.countDown = 3; // Lets show 3 second countDown
        this.totalTime = 60; // How long the player has to win
        this.countTime = 0; // Elapsed time while game is playing
        this.shownTime = 0; // Time shown as string format
        this.interCount = null; // Timer: 1 second for in game counter
        this.userLife = 6;
        this.resetSelects();
        this.populateCards();
        this.shuffle(this.cardsArray);
        this.shuffle(this.gameService.images);
        setTimeout(function () {
            _this.startGame = true; // Actually start the game
            _this.gameState = 'init'; // Game has been initialized
        }, this.countDown * 1000);
        // This will subtract 1 from countdown start time
        this.interCount = setInterval(function () {
            if (_this.countDown === 0) {
                clearInterval(_this.interCount);
                _this.interCount = null;
            }
            else
                _this.countDown -= 1;
        }, 1000);
        // This timer will keep track of time once the game starts
        setTimeout(function () {
            _this.interTime = setInterval(function () {
                if (_this.countTime >= _this.totalTime)
                    _this.loseCon();
                if (_this.gameState == 'init') {
                    _this.countTime += 1; // Add 1 second to counter
                    var minutes = Math.floor((_this.totalTime - _this.countTime) / 60);
                    var seconds = (_this.totalTime - _this.countTime) - minutes * 60;
                    _this.shownTime = minutes.toString() + ":" + seconds.toString();
                }
                else {
                    clearInterval(_this.interTime);
                    _this.interTime = null;
                }
            }, 1000);
        }, this.countDown * 1000 + 200);
    };
    // Win condition
    Level3Page.prototype.winCon = function () {
        var winCheck = false;
        // If at least 1 or more cards have not been solved,
        // then user hasn't won yet
        for (var i = 0; i < this.cardsArray.length; i++)
            if (this.cardsArray[i].val != -1)
                winCheck = true;
        // if winCheck is false, player has won the game
        if (winCheck == false)
            this.gameState = 'win';
    };
    // Lose condition
    Level3Page.prototype.loseCon = function () {
        this.gameState = 'lose';
    };
    // Function to reset selected cards
    Level3Page.prototype.resetSelects = function () {
        this.selectCard1pos = -1; // Selected card #1 position
        this.selectCard1val = -1; // Selected card #1 value
        this.selectCard2pos = -1; // Selected card #2 position
        this.selectCard2val = -1; // Selected card #2 value
    };
    Level3Page.ctorParameters = function () { return [
        { type: src_app_services_game_service__WEBPACK_IMPORTED_MODULE_1__["GameService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
    ]; };
    Level3Page = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-level3',
            template: __importDefault(__webpack_require__(/*! raw-loader!./level3.page.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/pages/level3/level3.page.html")).default,
            styles: [__importDefault(__webpack_require__(/*! ./level3.page.scss */ "./src/app/pages/level3/level3.page.scss")).default]
        }),
        __metadata("design:paramtypes", [src_app_services_game_service__WEBPACK_IMPORTED_MODULE_1__["GameService"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"]])
    ], Level3Page);
    return Level3Page;
}());



/***/ })

}]);
//# sourceMappingURL=pages-level3-level3-module.js.map