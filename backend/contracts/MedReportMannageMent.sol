// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


contract MedicalReport{
    event AddDetails(string details);
    event AccessDetails();
    event GiveAccess(address account);
    event RevokeAccess(address account);

    address public ownerAddress;
    string public details;
    mapping(address => bool) public providers;

    address[] private keys;


    function _hasAccess(address _account) view public returns(bool) {
        return (ownerAddress == _account || providers[_account]);
    }

    function isOwner(address _provider) view internal returns(bool) {
        return (ownerAddress == _provider);
    }

    constructor(string memory details_, address sender_){
        ownerAddress = sender_;
        _addDetails(details_);
    }

    function _addDetails(string memory _details) internal{
        details = _details;
        emit AddDetails(_details);
    }

    function _verifyAccess(address _account) external view returns(bool){
        if(providers[_account]){
            return true;
        } else{
            return false;
        }
    }

    function _accessDetails(address sender) external view returns(string memory){
        if(_hasAccess(sender)){
            return details;
        }
        revert("not authorized");
    }

    function _getOwner() external view returns(address){
        return ownerAddress;
    }

    function _giveAccess(address _owner, address _account) external returns(string memory){
        if(isOwner(_owner)){
            if(!providers[_account]){
                providers[_account] = true;
                keys.push(_account);
                return "done";
            }
            return "already exist";
        } else{
            revert("not authorized");
        }
    }

    function _revokeAccess(address _owner, address _account) external returns(string memory){
        if(isOwner(_owner)){
            providers[_account] = false;
            return "done";
        } else{
            revert("not authorized");
        }
    }

    function _allProvider(address _owner) external view returns(providerAll[] memory){
        if(isOwner(_owner)){
            providerAll[] memory allProviderDetails = new providerAll[](keys.length);
            for(uint i=0; i < keys.length; i++ ){
                allProviderDetails[i] = providerAll(keys[i], providers[keys[i]]);
            }
            return allProviderDetails;
        }
        revert("not authorized");
    }
}

    struct providerAll{
        address providerAdd;
        bool premission;
    }

contract User {
    event UnqIdGen();

    struct report{
        string details;
        MedicalReport repAddress;
    }

    address public ownerAddress;
    uint private unqId;

    constructor(){
        ownerAddress = msg.sender;
        unqId= 0;
    }

    MedicalReport[] public _medicalReport;

    function _unqIdGen() internal{
        unqId ++;
        emit UnqIdGen();
    }

    function _addMedicalReport(string memory _details) external{
        _medicalReport.push(new MedicalReport(_details, ownerAddress));
        _unqIdGen();
    }

    function _getDetails(uint _id) public view returns(string memory){
        return _medicalReport[_id]._accessDetails(msg.sender);
    }

    function _getOwner(uint _id) internal view returns(address){
        return _medicalReport[_id]._getOwner();
    }

    function _giveAccess(uint _id, address _account) external returns(string memory){
        return _medicalReport[_id]._giveAccess(msg.sender, _account);
    }

    function _revokeAccess(uint _id, address _account) external returns(string memory){
        return _medicalReport[_id]._revokeAccess(msg.sender, _account);
    }

    function _allProvider(uint _id) external view returns(providerAll[] memory){
        providerAll[] memory allProviderDetails = _medicalReport[_id]._allProvider(msg.sender);
        return allProviderDetails;
    }

    function _allMedicalReport() external view returns(report[] memory){
        report[] memory allMedicalReport = new report[](_medicalReport.length);
        for(uint i=0; i < _medicalReport.length; i++ ){
            MedicalReport repAddress = _medicalReport[i];
            string memory details = _getDetails(i);
            allMedicalReport[i] = report({details:details , repAddress: repAddress});
        }
        return allMedicalReport;
    }

    function _removeEle(uint _index) internal {
        for(uint i = _index; i < _medicalReport.length-1; i++){
            _medicalReport[i] = _medicalReport[i+1];
        }
        _medicalReport.pop();
    }

    function _removeMedicalReport(uint _id) external {
        if(msg.sender == _getOwner(_id)){
            _removeEle(_id);
        } else{
            revert("not authorized");
        }
    }

}

contract Provider {
    address internal ownerAddress;

    struct accessReport{
        MedicalReport _reportId;
        bool access;
    }

    accessReport[] internal allAccessReport;

    MedicalReport[] internal keys;

    constructor(){
        ownerAddress = msg.sender;
    }

    function _existsEle(MedicalReport _reportId) internal view returns (bool) {
        for (uint i = 0; i < allAccessReport.length; i++) {
            if (allAccessReport[i]._reportId == _reportId) {
                return true;
            }
        }
        return false;
    }

    function _removeEle(uint _index) internal {
        for(uint i = _index; i < allAccessReport.length-1; i++){
            allAccessReport[i] = allAccessReport[i+1];
        }
        allAccessReport.pop();
    }

    function _updateEle(uint _index, bool _access) internal {
        allAccessReport[_index].access = _access;
    }

    function _queryIndex(MedicalReport _reportId) internal view returns (int) {
        for (int i = 0; i < int(allAccessReport.length); i++) {
            if (allAccessReport[uint256(i)]._reportId == _reportId) {
                return i;
            }
        }
        return -1;
    }

    function _verifyDetail(MedicalReport _reportId) external returns(string memory){
        if(_reportId._verifyAccess(msg.sender)){
            if(!_existsEle(_reportId)){
                allAccessReport.push(accessReport({_reportId:_reportId, access: true}));
            }
            return _getDetails(_reportId);
        } else{
            int idx = _queryIndex(_reportId);
            if(idx != -1){
                _updateEle(uint(idx), false);
            }
            revert("not authorized");
        }
    }

    function _allhaveAccess() external view returns(accessReport[] memory){
        return allAccessReport;
    }

    function _removeReport(MedicalReport _reportId) external{
        int idx = _queryIndex(_reportId);
        if(idx != -1){
            _removeEle(uint(idx));
            return;
        }
        revert("report does not exist!");
    }

    function _getDetails(MedicalReport _reportId) public view returns(string memory){
        return _reportId._accessDetails(msg.sender);
    }

    function _getOwner(MedicalReport _reportId) external view returns(address){
        return _reportId._getOwner();
    }
}