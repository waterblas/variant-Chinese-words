# Variant Chinese Words Detector
There are various of Chinese characters. Some of them look similar, have the same pronunciation, or be a part of other characters, such as 云 is a part of 动, and I use Variant words to describe the words made of them.    
I use chinese characters feature to detect Variant words, and search Variant words about the input words in import text.
存在由同音字，形近字或拆分字组成的词语成为变体词，如‘啊’和‘阿’是同音字，‘发’和‘友’为形近字，‘飘’可以拆为‘票’和‘风’，变体词很多时候与原词能传达出相同的意义。首先提取出GB2312标准的6763个汉字特征，k-means聚类和系统聚类得到形近字表，结合同音字和拆分字信息，得到变体字库。本项目用node-webkit项目做了变体词的匹配识别客户端。

## Getting Started
Download the [nw.js](https://github.com/nwjs/nw.js), I build in v0.10.5-x64 version. Then build your own [node-sqlite](https://github.com/mapbox/node-sqlite3) module, and replace the folder(./node_modules/sqlite3).

## Usage

先点击文件选择按钮，则会调用系统api打开文件管理系统，选择要识别的文本文件，然后点击模式复选框，选择识别模式，接着在搜索框输入词语，最后点击搜索按钮，系统就会在事先选择的文本文件中识别输入词的变体词。

![variant_1](http://7xkrbx.com1.z0.glb.clouddn.com/variant_1.png)

测试文件有4个：test_1、test_2、test_3、test_4，文本内容如下：

- test_1：湖南大部分地区或有伏秋干旱友生 湘中湘南应提早应对
- test_2：北京市发布大风蓝色预警
- test_3：高考正式阅卷今日开始 "分歧大"英语作文可三评
- test_4：本公司有大量税漂

![variant_2](http://7xkrbx.com1.z0.glb.clouddn.com/variant_2.png)

将测试的文本文件读入后，输入“税票”，搜索变体词，‘漂’和‘票’是同音字，因此“税漂”是“税票”的变体词，在test_4文件中匹配成功。

![variant_3](http://7xkrbx.com1.z0.glb.clouddn.com/variant_3.png)