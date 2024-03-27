import './App.css'
import {
  Heading,
  Container,
  Text,
  Button,
  Stack,
  Wrap,
  Image,
  SkeletonText,
  Slider,
  SliderMark,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Textarea,
  SimpleGrid,
  Alert,
  AlertIcon,
  Radio,
  RadioGroup,
  HStack,
  useRadio,
  useRadioGroup,
  Skeleton,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props)

  const input = getInputProps()
  const checkbox = getRadioProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: 'green.500',
          color: 'white',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  )
}

function App() {
  const [image, updateImage] = useState();
  const [prompt, updatePrompt] = useState();
  const [negative, updateNegative] = useState();
  const [loading, updateLoading] = useState();
  const [btnLook, updateBtn] = useState();
  const [steps, setStepValue] = useState(40);
  const [noise, setNoiseValue] = useState(0.8);

  const options = ['4k', 'Cartoon', 'Anime', 'Future', 'Trippy']

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'framework',
    defaultValue: 'react',
    onChange: console.log,
  })

  const group = getRootProps()

  const call_api = async (data) => {
    const result = await axios.post('http://127.0.0.1:9000/gen', data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return null;
      });
    return result;
  }

  const generate = async (prompt, negative, steps, noise) => {
    updateLoading(true);
    updateBtn(loading ? "outline" : "solid")

    const settings = {
      prompt: prompt,
      negative: negative,
      steps: steps,
      noise: noise
    };

    const data = await call_api(settings);
    updateImage(data);

    updateLoading(false);
    updateBtn(loading ? "outline" : "solid")
  };

  return (
    <SimpleGrid alignItems={"center"} width={"60vw"} columns={2}>
      <Heading
        mb={"25px"}>
        AI Image Generator
      </Heading>
      <div></div>
      <Container>
        <Text
          textAlign={"left"}>
          Prompt
        </Text>
        <Textarea
          mb={"10px"}
          value={prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          width={"100%"}
        ></Textarea>
        <Text
          textAlign={"left"}>
          Negative
        </Text>
        <Textarea
          mb={"10px"}
          value={negative}
          onChange={(e) => updateNegative(e.target.value)}
          width={"100%"}
        ></Textarea>
        <Text
          textAlign={"left"}>
          Steps
        </Text>
        <Box p={4} pt={6}>
          <Slider
            colorScheme="green"
            aria-label='slider-ex-6'
            onChange={(val) => setStepValue(val)}>
            <SliderMark
              value={steps}
              textAlign='center'
              bg='green.500'
              color='white'
              mt='-10'
              ml='-5'
              w='12'
            >
              {steps}
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Text
          textAlign={"left"}>
          Noise
        </Text>
        <Box p={4} pt={6}>
          <Slider
            colorScheme="green"
            min={0}
            max={1}
            step={0.1}
            aria-label='slider-ex-6'
            onChange={(val) => setNoiseValue(val)}>
            <SliderMark
              value={noise}
              textAlign='center'
              bg='green.500'
              color='white'
              mt='-10'
              ml='-5'
              w='12'
            >
              {noise}
            </SliderMark >
            <SliderTrack >
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
        <Wrap {...group}>
          {options.map((value) => {
            const radio = getRadioProps({ value })
            return (
              <RadioCard key={value} {...radio}>
                {value}
              </RadioCard>
            )
          })}
        </Wrap>
        <Button
          isLoading={loading}
          loadingText={"Generating..."}
          width={"100%"}
          variant={btnLook}
          onClick={(e) => generate(prompt, negative, steps, noise)}
          colorScheme={"green"}
          mb={"10px"}
          mt={"10px"}>
          Generate
        </Button>
      </Container >
      <Container>
        <Skeleton rounded={"15px"} isLoaded={!loading}>
          < Image rounded={"15px"} src={`data:image/png;base64,${image}`} boxShadow="lg" fallbackSrc='https://via.placeholder.com/1024' />
        </Skeleton>
      </Container>
    </SimpleGrid>
  )
}

export default App
