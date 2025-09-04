import React from 'react';
import './Fileupload.css';
import Profile from '../../Assets/profile.svg';
import Upload from '../../Assets/upload.svg';

function Fileupload({ input_name , onFileSelect, formData}) {

  return (
    <div className="file_upload">
      <div>
        {formData.profilePhoto ? (
          <img className="photo_preview" src={formData.profilePhoto} alt="Preview" />
        ) : (
          <img className="photo_preview" src={Profile} alt="Default Profile" />
        )}
      </div>
      <input type="file" id="file-input" name={input_name} onChange={onFileSelect} style={{ display: 'none' }} accept="image/*" />
      <div>
        <label htmlFor="file-input" className="upload-button">
          <img className='icon' src={Upload} alt="Upload Icon" />
          <p> Upload Image</p>
        </label>
        <p className="image_upload_insrtuction">File should be less than 100 KB</p>
        <p className="image_upload_insrtuction">File may be png, jpeg, or jpg</p>
      </div>
    </div>
  );
}

export default Fileupload;
