app.controller('chatController', ['$scope', ($scope) => {
    /**
     * Angular variables
     * @type {Array}
     */
    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 1;
    $scope.chatClicked = false;
    $scope.chatName = "";

    /**
     * socket.io event handling
     */
    const socket = io.connect('http://localhost:3000');
    socket.on('onlineList', users => {
        $scope.onlineList = users;
        $scope.$apply();
    });

    socket.on('roomList', rooms => {
        $scope.roomList = rooms;
        $scope.$apply();
    });

    $scope.switchRoom = room => {
        $scope.chatName = room.roomName;
        $scope.chatClicked = true;
        //$scope.$apply();
    }
    $scope.newRoom = () => {
        //let randomName = Math.random().toString(36).substring(7);

        let roomName = window.prompt("Enter a room name");
        if(roomName !== '' && roomName !== null){
            socket.emit('newRoom', roomName);
        }
    }

    $scope.changeTab = tab =>{
        $scope.activeTab = tab;
    }
}]);