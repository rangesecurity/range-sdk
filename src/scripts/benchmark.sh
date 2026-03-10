yarn
yarn build 

# Run with different rule counts (r) and thread counts (t)
for r in 1000 2000 3000 4000 5000; do
  for t in 5 10 20 30 40; do
    yarn start -r $r -t $t
  done
done