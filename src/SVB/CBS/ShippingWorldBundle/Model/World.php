<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 16:30
 */

namespace SVB\CBS\ShippingWorldBundle\Model;

use HireVoice\Neo4j\Annotation as OGM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * Class World
 * @package SVB\CBS\ShippingWorldBundle\Model
 *
 * @OGM\Entity(labels="World")
 */
class World implements WorldInterface
{

    /**
     * @var int
     *
     * @OGM\Auto
     */
    private $id;

    /**
     * @var string
     *
     * @OGM\Property
     * @OGM\Index
     */
    private $name;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $extent;

    /**
     * @var int
     *
     * @OGM\Property
     */
    private $gestalt;

    /**
     * @var IslandInterface[]
     *
     * @OGM\ManyToMany(relation="island_within_world",direction="to",readOnly=true)
     */
    private $islands;

    /**
     * @var ShipInterface[]
     *
     * @OGM\ManyToMany(relation="ship_within_world",direction="to",readOnly=true)
     */
    private $ships;

    public function __construct(){
        $this->islands = new ArrayCollection();
        $this->ships = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param int $id
     * @return World
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * @param string $name
     * @return World
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return int
     */
    public function getExtent()
    {
        return $this->extent;
    }

    /**
     * @param int $extent
     * @return World
     */
    public function setExtent($extent)
    {
        $this->extent = $extent;
        return $this;
    }

    /**
     * @return int
     */
    public function getGestalt()
    {
        return $this->gestalt;
    }

    /**
     * @param int $gestalt
     * @return World
     */
    public function setGestalt($gestalt)
    {
        $this->gestalt = $gestalt;
        return $this;
    }

    /**
     * @return ShipInterface[]
     */
    public function getIslands()
    {
        return $this->islands;
    }

    /**
     * @param IslandInterface $island
     * @return World
     */
    public function addIsland($island)
    {
        $this->islands->add($island);
        return $this;
    }

    /**
     * @return ShipInterface[]
     */
    public function getShips()
    {
        return $this->ships;
    }

    /**
     * @param ShipInterface $ship
     * @return World
     */
    public function addShip($ship)
    {
        $this->ships->add($ship);
        return $this;
    }

    /**
     * @return array
     */
    public function export()
    {
        $islands = $this->getIslands()->toArray();
        $villages = array();

        foreach ($islands as $island){
            $villages = array_merge($villages, $island->getVillages()->toArray());
        }

        return [

            'name' => $this->getName(),

            'terrain' => [

                'extent' => $this->getExtent(),

                'levels' => [

                    'ground' => [
                        'height' => 0,
                        'displace' => [
                            'seed' => $this->getGestalt()
                        ]
                    ],

                    'sea' => [
                        'depth' => 1
                    ]

                ],

                'islands' => array_map(function(IslandInterface $island){
                    return $island->export();
                }, $islands)
            ],
            'colonization' => [

                'villages' => array_map(function(VillageInterface $village){
                    return $village->export();
                }, $villages)

            ]
        ];
    }
}