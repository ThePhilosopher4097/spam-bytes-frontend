read -p "Enter Page name : " page_name;

target_path=src/pages/
mkdir $target_path$page_name;
touch $target_path$page_name/$page_name.jsx;

sed -i '' -e "s/ComponentTemplate/$page_name/g" ./scripts/ComponentTemplate.jsx;

cat ./scripts/ComponentTemplate.jsx > $target_path$page_name/$page_name.jsx;

sed -i '' -e "s/$page_name/ComponentTemplate/g" ./scripts/ComponentTemplate.jsx;

touch $target_path$page_name/$page_name.css;
mkdir $target_path$page_name/assets;

