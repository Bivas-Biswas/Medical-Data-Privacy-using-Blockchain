// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract MedicalReport {
    event AddDetails(string details);
    event AccessDetails();
    event GiveAccess(address account);
    event RevokeAccess(address account);

    address public ownerAddress;
    string public details;
    mapping(address => bool) public providers;
    // mapping(address => bool) private providersDetils;

    address[] private keys;

    function haveAccess(address _account) internal view returns (bool) {
        return (ownerAddress == _account || providers[_account]);
    }

    function isOwner(address _provider) internal view returns (bool) {
        return (ownerAddress == _provider);
    }

    constructor(string memory details_, address sender_) {
        ownerAddress = sender_;
        _addDetails(details_);
    }

    function _addDetails(string memory _details) internal {
        details = _details;
        emit AddDetails(_details);
    }

    function _verifyAccess(address _account) external view returns (bool) {
        if (providers[_account]) {
            return true;
        } else {
            return false;
        }
    }

    function _accessDetails(address sender)
        external
        view
        returns (string memory)
    {
        if (haveAccess(sender)) {
            return details;
        }
        revert("not authorized");
    }

    function _getOwner() external view returns (address) {
        return ownerAddress;
    }

    function _giveAccess(address _owner, address _account)
        external
        returns (string memory)
    {
        if (isOwner(_owner)) {
            providers[_account] = true;
            keys.push(_account);
            return "done";
        } else {
            revert("not authorized");
        }
    }

    function _revokeAccess(address _owner, address _account)
        external
        returns (string memory)
    {
        if (isOwner(_owner)) {
            providers[_account] = false;
            return "done";
        } else {
            revert("not authorized");
        }
    }

    function _allProvider(address _owner)
        external
        view
        returns (providerAll[] memory)
    {
        if (isOwner(_owner)) {
            providerAll[] memory allProviderDetails = new providerAll[](
                keys.length
            );
            for (uint256 i = 0; i < keys.length; i++) {
                allProviderDetails[i] = providerAll(
                    keys[i],
                    providers[keys[i]]
                );
            }
            return allProviderDetails;
        }
        revert("not authorized");
    }
}

struct providerAll {
    address providerAdd;
    bool premission;
}

contract User {
    event UnqIdGen();

    address public ownerAddress;
    uint256 private unqId;

    constructor() {
        ownerAddress = msg.sender;
        unqId = 0;
    }

    function _unqIdGen() internal {
        unqId++;
        emit UnqIdGen();
    }

    MedicalReport[] public _medicalReport;

    function _addMedicalReport(string memory _details) external {
        _medicalReport.push(new MedicalReport(_details, ownerAddress));
        _unqIdGen();
    }

    function _getDetails(uint256 _id) public view returns (string memory) {
        return _medicalReport[_id]._accessDetails(msg.sender);
    }

    function _getOwner(uint256 _id) external view returns (address) {
        return _medicalReport[_id]._getOwner();
    }

    function _giveAccess(uint256 _id, address _account)
        external
        returns (string memory)
    {
        return _medicalReport[_id]._giveAccess(msg.sender, _account);
    }

    function _revokeAccess(uint256 _id, address _account)
        external
        returns (string memory)
    {
        return _medicalReport[_id]._revokeAccess(msg.sender, _account);
    }

    function _allProvider(uint256 _id)
        external
        view
        returns (providerAll[] memory)
    {
        providerAll[] memory allProviderDetails = _medicalReport[_id]
            ._allProvider(msg.sender);
        return allProviderDetails;
    }

    struct report {
        string details;
        MedicalReport repAddress;
    }

    function _allMedicalReport() external view returns (report[] memory) {
        report[] memory allMedicalReport = new report[](_medicalReport.length);
        for (uint256 i = 0; i < _medicalReport.length; i++) {
            MedicalReport repAddress = _medicalReport[i];
            string memory details = _getDetails(i);
            allMedicalReport[i] = report({
                details: details,
                repAddress: repAddress
            });
        }
        return allMedicalReport;
    }
}

contract Provider {
    address public ownerAddress;

    mapping(MedicalReport => bool) public haveAccess;
    MedicalReport[] private keys;

    struct accessReport {
        MedicalReport _reportId;
        bool access;
    }

    constructor() {
        ownerAddress = msg.sender;
    }

    function _verifyDetail(MedicalReport _reportId) external returns (bool) {
        if (_reportId._verifyAccess(msg.sender)) {
            haveAccess[_reportId] = true;
            keys.push(_reportId);
            return true;
        } else {
            haveAccess[_reportId] = false;
            return false;
        }
    }

    function _allhaveAccess() external view returns (accessReport[] memory) {
        accessReport[] memory allAccessReport = new accessReport[](keys.length);
        for (uint256 i = 0; i < keys.length; i++) {
            allAccessReport[i] = accessReport(keys[i], haveAccess[keys[i]]);
        }
        return allAccessReport;
    }

    function _getDetails(MedicalReport _reportId)
        external
        view
        returns (string memory)
    {
        return _reportId._accessDetails(msg.sender);
    }

    function _getOwner(MedicalReport _reportId)
        external
        view
        returns (address)
    {
        return _reportId._getOwner();
    }
}
// 0x4764341808e7432531ACEBc42446477B198d1aC7

// 0x23Ce7C3202F496F893c258CB4d8D418502091dd7