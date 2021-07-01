import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from 'components/Form';
import { Spacing } from 'components/Layout';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  padding: ${(p) => p.theme.spacing.xs} 0;
`;

const ImagePreviewContainer = styled.div`
  width: 60%;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: ${(p) => p.theme.shadows.sm};
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Input = styled.input`
  height: 36px;
  outline: none;
  border: 1px solid ${(p) => p.theme.colors.border.main};
  border-radius: ${(p) => p.theme.radius.sm};
  color: ${(p) => p.theme.colors.text.secondary};
  padding: ${(p) => p.theme.spacing.xs};
`;

const Options = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

const Heading = styled.div`
  text-align: center;
  border-bottom: 1px solid ${(p) => p.theme.colors.border.main};
  padding: ${(p) => p.theme.spacing.sm} 0;
`;

/**
 * Component for creating a post
 */
const SortPhotos = ({ images, setImages, handleSubmit, handleReset, setIsSorting, pageIndices, setPageIndices }) => {
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const [isUploadDisabled, setIsUploadDisabled] = useState(true);

  const handleBackClick = () => {
    setIsSorting(false);
  };

  const handleChange = (e, idx) => {
    let value = e.target.value;

    if (value !== '') {
      value = parseInt(value);

      if (value <= 0 || value > images.length) return;
    }

    setPageIndices(pageIndices.map((pi, i) => (i === idx ? value : pi)));

    if (isSaveDisabled) {
      setIsSaveDisabled(false);
    }

    if (!isUploadDisabled) {
      setIsUploadDisabled(true);
    }
  };

  const handleUploadClick = (e) => {
    setIsUploadDisabled(true);
    handleSubmit(e);
    handleReset();
  };

  const handleSaveClick = () => {
    // cancel if pageIndices contains empty values
    if (pageIndices.includes('')) {
      console.log('page indices can only contains numbers');
      return;
    }

    // cancel if duplicates in pageIndices
    if (pageIndices.length !== new Set(pageIndices).size) {
      console.log('resolve duplicate page number');
      return;
    }

    setImages(images.map((el, idx, arr) => arr[pageIndices[idx] - 1]));

    setPageIndices(images.map((el, idx) => idx + 1));

    if (!isSaveDisabled) {
      setIsSaveDisabled(true);
    }

    if (isUploadDisabled) {
      setIsUploadDisabled(false);
    }
  };

  return (
    <>
      <Heading>Add correct page number</Heading>

      <Spacing top="sm" bottom="sm">
        {images &&
          images.map((image, idx) => (
            <Wrapper key={image.name}>
              <ImagePreviewContainer>
                <ImagePreview src={URL.createObjectURL(image)} />
              </ImagePreviewContainer>

              <Input
                type="number"
                value={pageIndices[idx]}
                onChange={(e) => handleChange(e, idx)}
                min={1}
                max={images.length}
                step={1}
              />
            </Wrapper>
          ))}
      </Spacing>

      <Options>
        <Button text type="button" onClick={handleBackClick}>
          Back
        </Button>
        <Button disabled={isSaveDisabled} color="info" type="button" onClick={handleSaveClick}>
          Save
        </Button>
        <Button disabled={isUploadDisabled} type="button" onClick={handleUploadClick}>
          Upload
        </Button>
      </Options>
    </>
  );
};

export default SortPhotos;
